import { NodeConnectionTypes, NodeOperationError } from "n8n-workflow";
import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import {
  failure,
  object,
  output,
  request,
  requiredText,
  submissionResult,
  taskIds,
  taskResult,
  integer,
} from "./helpers";
import { properties } from "./properties";
import { buildRequest } from "./request";
export class Fish implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Fish Audio by AceDataCloud",
    name: "fish",
    icon: { light: "file:icon.png", dark: "file:icon.dark.png" },
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      "Turn text into Fish Audio speech, use reference voices, discover voice models, and track synthesis tasks in workflows.",
    defaults: { name: "Fish Audio by AceDataCloud" },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [{ name: "aceDataFishApi", required: true }],
    properties,
  };
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const result: INodeExecutionData[] = [];
    const credential = "aceDataFishApi";
    for (let index = 0; index < this.getInputData().length; index++) {
      try {
        const resource = this.getNodeParameter("resource", index) as string;
        const operation = this.getNodeParameter("operation", index) as string;
        const simplify = this.getNodeParameter(
          "simplify",
          index,
          true,
        ) as boolean;
        if (resource === "task") {
          let body: IDataObject;
          if (operation === "get")
            body = {
              action: "retrieve",
              id: requiredText(
                this.getNodeParameter("taskId", index),
                "Task ID",
              ),
            };
          else if (operation === "getMany")
            body = {
              action: "retrieve_batch",
              ids: taskIds(this.getNodeParameter("taskIds", index)),
            };
          else
            throw new NodeOperationError(
              this.getNode(),
              "Select a supported task operation",
            );
          const response = await request(this, credential, "/fish/tasks", body);
          const records = operation === "getMany" ? response.items : [response];
          if (!Array.isArray(records))
            throw new NodeOperationError(
              this.getNode(),
              "The service returned an unexpected task list",
            );
          const valid = records.map((record) => object(record));
          if (valid.some((record) => !record.id && !record.task_id))
            throw new NodeOperationError(
              this.getNode(),
              "The task was not found. Check the task ID and API credential",
            );
          result.push(
            ...output(
              this,
              valid.map((record) => (simplify ? taskResult(record) : record)),
              index,
            ),
          );
          continue;
        }

        if (resource === "voice") {
          if (operation === "get") {
            const id = requiredText(
              this.getNodeParameter("voiceId", index),
              "Voice ID",
            );
            const response = await request(
              this,
              credential,
              `/fish/model/${encodeURIComponent(id)}`,
              {},
              "GET",
            );
            result.push(
              ...output(
                this,
                [
                  simplify
                    ? {
                        voiceId: response._id ?? response.id ?? id,
                        title: response.title ?? null,
                        description: response.description ?? null,
                        languages: response.languages ?? [],
                        tags: response.tags ?? [],
                        samples: response.samples ?? [],
                      }
                    : response,
                ],
                index,
              ),
            );
          } else if (operation === "search") {
            const qs: IDataObject = {
              page_size: integer(
                this.getNodeParameter("limit", index, 20),
                "Limit",
                1,
                100,
              ),
              page_number: integer(
                this.getNodeParameter("pageNumber", index, 1),
                "Page Number",
                1,
                10000,
              ),
            };
            const title = this.getNodeParameter("search", index, "") as string;
            const language = this.getNodeParameter(
              "language",
              index,
              "",
            ) as string;
            if (title.trim()) qs.title = title.trim();
            if (language.trim()) qs.language = language.trim();
            if (this.getNodeParameter("selfOnly", index, false)) qs.self = true;
            const response = await request(
              this,
              credential,
              "/fish/model",
              qs,
              "GET",
            );
            if (!Array.isArray(response.items))
              throw new NodeOperationError(
                this.getNode(),
                "The service returned an unexpected voice list",
              );
            result.push(
              ...output(
                this,
                response.items.map((item) => {
                  const voice = object(item);
                  return simplify
                    ? {
                        voiceId: voice._id ?? voice.id ?? null,
                        title: voice.title ?? null,
                        description: voice.description ?? null,
                        languages: voice.languages ?? [],
                        tags: voice.tags ?? [],
                        samples: voice.samples ?? [],
                      }
                    : voice;
                }),
                index,
              ),
            );
          } else
            throw new NodeOperationError(
              this.getNode(),
              "Select a supported voice operation",
            );
          continue;
        }

        if (resource !== "audio")
          throw new NodeOperationError(
            this.getNode(),
            "Select a supported resource",
          );
        const spec = buildRequest(this, index);
        const response = await request(
          this,
          credential,
          spec.endpoint,
          spec.body,
          "POST",
          spec.headers,
        );
        const normalized = submissionResult(response);
        result.push(...output(this, [simplify ? normalized : response], index));
      } catch (error) {
        result.push(failure(this, error, index));
      }
    }
    return [result];
  }
}
