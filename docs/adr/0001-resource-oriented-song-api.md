# Resource-oriented song API

The API will expose songs as the main resource using standard REST methods, with derived catalogue statistics available at `GET /api/songs/statistics`. Song collection reads will support query parameters such as `page`, `limit`, and `genre` so the list endpoint is bounded and filterable from the start. This keeps CRUD operations conventional while making statistics clearly scoped to the song collection instead of introducing a vague top-level `stats` resource.
