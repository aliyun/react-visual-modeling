export const columns = [
  {
    key: 'id',
    primaryKey: true,
    width: 76
  },
  {
    key: 'type',
    width: 60,
    render: (val, row) => {
      return val.toString().toUpperCase();
    }
  }, 
  {
    key: 'desc',
    width: 90
  }
];

export const data = {
  "nodes": [
    {
      "top": 300,
      "left": 200,
      "id": "aaa",
      "title": "aaa",
      "fields": [
        {
          "id": "field_1",
          "type": "string",
          "desc": "字段1"
        },
        {
          "id": "field_2",
          "type": "string",
          "desc": "字段2"
        },
        {
          "id": "field_3",
          "type": "string",
          "desc": "字段3"
        }
      ]
    },
    {
      "top": 500,
      "left": 600,
      "id": "bbb",
      "title": "bbb",
      "fields": [
        {
          "id": "field_1",
          "type": "string",
          "desc": "字段1"
        },
        {
          "id": "field_2",
          "type": "string",
          "desc": "字段2"
        },
        {
          "id": "field_3",
          "type": "string",
          "desc": "字段3"
        }
      ]
    },
    {
      "top": 300,
      "left": 1000,
      "id": "ccc",
      "title": "ccc",
      "fields": [
        {
          "id": "field_1",
          "type": "string",
          "desc": "字段1"
        },
        {
          "id": "field_2",
          "type": "string",
          "desc": "字段2"
        },
        {
          "id": "field_3",
          "type": "string",
          "desc": "字段3"
        }
      ]
    },
    {
      "top": 100,
      "left": 600,
      "id": "ddd",
      "title": "ddd",
      "fields": [
        {
          "id": "field_1",
          "type": "string",
          "desc": "字段1"
        },
        {
          "id": "field_2",
          "type": "string",
          "desc": "字段2"
        },
        {
          "id": "field_3",
          "type": "string",
          "desc": "字段3"
        }
      ]
    },
    {
      "top": 50,
      "left": 1000,
      "id": "eee",
      "title": "eee",
      "fields": [
        {
          "id": "field_1",
          "type": "string",
          "desc": "字段1"
        },
        {
          "id": "field_2",
          "type": "string",
          "desc": "字段2"
        },
        {
          "id": "field_3",
          "type": "string",
          "desc": "字段3"
        }
      ]
    },
    {
      "top": 540,
      "left": 1000,
      "id": "fff",
      "title": "自定义空内容",
      "fields": []
    }
  ],
  "edges": [
    {
      "id": 1,
      "sourceNode": "aaa",
      "targetNode": "bbb",
      "source": "field_1",
      "target": "field_1",
      "label": "label"
    },
    {
      "id": 2,
      "sourceNode": "aaa",
      "targetNode": "bbb",
      "source": "field_3",
      "target": "field_3"
    },
    {
      "id": 3,
      "sourceNode": "aaa",
      "targetNode": "ddd",
      "source": "field_2",
      "target": "field_2"
    },
    {
      "id": 4,
      "sourceNode": "ddd",
      "targetNode": "eee",
      "source": "field_2",
      "target": "field_2"
    },
    {
      "id": 5,
      "sourceNode": "ddd",
      "targetNode": "ccc",
      "source": "field_2",
      "target": "field_2"
    },
    {
      "id": 6,
      "sourceNode": "bbb",
      "targetNode": "eee",
      "source": "field_1",
      "target": "field_3"
    },
    {
      "id": 7,
      "sourceNode": "bbb",
      "targetNode": "ccc",
      "source": "field_3",
      "target": "field_1"
    },
    {
      "id": 8,
      "sourceNode": "bbb",
      "targetNode": "ccc",
      "source": "field_3",
      "target": "field_3",
      "arrowShapeType": "arrow1"
    }
  ]
};
