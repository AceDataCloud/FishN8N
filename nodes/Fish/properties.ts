import type { INodeProperties } from 'n8n-workflow';
export const properties: INodeProperties[] = [
  {
    "displayName": "Resource",
    "name": "resource",
    "type": "options",
    "default": "audio",
    "options": [
      {
        "name": "Audio",
        "value": "audio"
      },
      {
        "name": "Task",
        "value": "task"
      },
      {
        "name": "Voice",
        "value": "voice"
      }
    ],
    "noDataExpression": true
  },
  {
    "displayName": "Operation",
    "name": "operation",
    "type": "options",
    "default": "create",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ]
      }
    },
    "options": [
      {
        "name": "Generate Speech",
        "value": "create",
        "description": "Synthesize speech from text",
        "action": "Generate speech"
      }
    ],
    "noDataExpression": true
  },
  {
    "displayName": "Operation",
    "name": "operation",
    "type": "options",
    "default": "get",
    "displayOptions": {
      "show": {
        "resource": [
          "task"
        ]
      }
    },
    "options": [
      {
        "name": "Get",
        "value": "get",
        "description": "Retrieve one existing task",
        "action": "Get a task"
      },
      {
        "name": "Get Many",
        "value": "getMany",
        "description": "Retrieve up to 50 specific task IDs",
        "action": "Get many tasks"
      }
    ],
    "noDataExpression": true
  },
  {
    "displayName": "Task ID",
    "name": "taskId",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "task"
        ],
        "operation": [
          "get"
        ]
      }
    },
    "required": true,
    "description": "The task ID returned by a generation operation"
  },
  {
    "displayName": "Task IDs",
    "name": "taskIds",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "task"
        ],
        "operation": [
          "getMany"
        ]
      }
    },
    "required": true,
    "description": "Up to 50 comma-separated task IDs"
  },
  {
    "displayName": "Operation",
    "name": "operation",
    "type": "options",
    "default": "search",
    "displayOptions": {
      "show": {
        "resource": [
          "voice"
        ]
      }
    },
    "options": [
      {
        "name": "Get",
        "value": "get",
        "description": "Retrieve a voice model by ID",
        "action": "Get a voice"
      },
      {
        "name": "Search",
        "value": "search",
        "description": "Search one bounded page of available voices",
        "action": "Search voices"
      }
    ],
    "noDataExpression": true
  },
  {
    "displayName": "Text",
    "name": "text",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ]
      }
    },
    "required": true,
    "typeOptions": {
      "rows": 4
    },
    "description": "The text to synthesize"
  },
  {
    "displayName": "Model",
    "name": "model",
    "type": "options",
    "default": "s2-pro",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ]
      }
    },
    "options": [
      {
        "name": "S1",
        "value": "s1"
      },
      {
        "name": "s2-pro",
        "value": "s2-pro"
      },
      {
        "name": "s2.1-pro",
        "value": "s2.1-pro"
      }
    ]
  },
  {
    "displayName": "Audio Format",
    "name": "format",
    "type": "options",
    "default": "mp3",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ]
      }
    },
    "options": [
      {
        "name": "Mp3",
        "value": "mp3"
      },
      {
        "name": "Pcm",
        "value": "pcm"
      },
      {
        "name": "Wav",
        "value": "wav"
      }
    ]
  },
  {
    "displayName": "Voice Source",
    "name": "voiceSource",
    "type": "options",
    "default": "default",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ]
      }
    },
    "options": [
      {
        "name": "Default Voice",
        "value": "default"
      },
      {
        "name": "Reference Audio",
        "value": "reference"
      },
      {
        "name": "Voice ID",
        "value": "id"
      }
    ]
  },
  {
    "displayName": "Voice IDs",
    "name": "voiceIds",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ],
        "voiceSource": [
          "id"
        ]
      }
    },
    "required": true,
    "description": "One voice ID or comma-separated voice IDs"
  },
  {
    "displayName": "Reference Audio URL",
    "name": "referenceAudioUrl",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ],
        "voiceSource": [
          "reference"
        ]
      }
    },
    "required": true,
    "description": "A public HTTPS reference audio URL"
  },
  {
    "displayName": "Reference Transcript",
    "name": "referenceText",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ],
        "voiceSource": [
          "reference"
        ]
      }
    },
    "required": true,
    "typeOptions": {
      "rows": 3
    },
    "description": "The exact words spoken in the reference audio"
  },
  {
    "displayName": "Voice ID",
    "name": "voiceId",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "voice"
        ],
        "operation": [
          "get"
        ]
      }
    },
    "required": true,
    "description": "The voice model ID to retrieve"
  },
  {
    "displayName": "Limit",
    "name": "limit",
    "type": "number",
    "default": 50,
    "displayOptions": {
      "show": {
        "resource": [
          "voice"
        ],
        "operation": [
          "search"
        ]
      }
    },
    "typeOptions": {
      "minValue": 1,
      "maxValue": 100,
      "numberPrecision": 0
    },
    "description": "Max number of results to return"
  },
  {
    "displayName": "Page Number",
    "name": "pageNumber",
    "type": "number",
    "default": 1,
    "displayOptions": {
      "show": {
        "resource": [
          "voice"
        ],
        "operation": [
          "search"
        ]
      }
    },
    "typeOptions": {
      "minValue": 1,
      "maxValue": 10000,
      "numberPrecision": 0
    },
    "description": "Page of matching voice models, starting from 1"
  },
  {
    "displayName": "Search",
    "name": "search",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "voice"
        ],
        "operation": [
          "search"
        ]
      }
    },
    "description": "Search voice titles. Leave empty to browse the public library."
  },
  {
    "displayName": "Language",
    "name": "language",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "voice"
        ],
        "operation": [
          "search"
        ]
      }
    },
    "description": "Optional language code, for example en or zh"
  },
  {
    "displayName": "My Voices Only",
    "name": "selfOnly",
    "type": "boolean",
    "default": false,
    "displayOptions": {
      "show": {
        "resource": [
          "voice"
        ],
        "operation": [
          "search"
        ]
      }
    },
    "description": "Whether to return only voices owned by your account"
  },
  {
    "displayName": "Options",
    "name": "options",
    "type": "collection",
    "default": {},
    "displayOptions": {
      "show": {
        "resource": [
          "audio"
        ]
      }
    },
    "placeholder": "Add Option",
    "options": [
      {
        "displayName": "Callback URL",
        "name": "callbackUrl",
        "type": "string",
        "default": "",
        "description": "Optional HTTPS webhook to receive the final result"
      },
      {
        "displayName": "Latency",
        "name": "latency",
        "type": "options",
        "default": "normal",
        "options": [
          {
            "name": "Balanced",
            "value": "balanced"
          },
          {
            "name": "Normal",
            "value": "normal"
          }
        ]
      },
      {
        "displayName": "MP3 Bitrate",
        "name": "mp3Bitrate",
        "type": "options",
        "default": 128,
        "options": [
          {
            "name": "128 Kbps",
            "value": 128
          },
          {
            "name": "192 Kbps",
            "value": 192
          },
          {
            "name": "64 Kbps",
            "value": 64
          }
        ]
      },
      {
        "displayName": "Normalize",
        "name": "normalize",
        "type": "boolean",
        "default": true,
        "description": "Whether to normalize the audio"
      },
      {
        "displayName": "Sample Rate",
        "name": "sampleRate",
        "type": "number",
        "default": 44100,
        "typeOptions": {
          "minValue": 8000,
          "maxValue": 48000,
          "numberPrecision": 0
        },
        "description": "Output audio sample rate in Hz"
      },
      {
        "displayName": "Speed",
        "name": "speed",
        "type": "number",
        "default": 1,
        "typeOptions": {
          "minValue": 0.5,
          "maxValue": 2
        },
        "description": "Speech speed multiplier"
      },
      {
        "displayName": "Volume",
        "name": "volume",
        "type": "number",
        "default": 0,
        "typeOptions": {
          "minValue": -20,
          "maxValue": 20
        },
        "description": "Volume adjustment in decibels"
      }
    ]
  },
  {
    "displayName": "Simplify",
    "name": "simplify",
    "type": "boolean",
    "default": true,
    "description": "Whether to return essential fields instead of the raw API response"
  }
];
