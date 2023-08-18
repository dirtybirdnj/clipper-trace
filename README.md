# clipper-trace


Clipper-trace is a service designed to ingest bitmap image and produce contour traces of the image. These traces are stacked together to produce a unique and fun trace rendition of the original. In addition to tracing, the layers should be able to do boolean operations

This project is the spiritual successor of facetrace, and specifically designed to address the separation of concerns issues that plauged the original. This is the backend I would have built then if I knew what I do now.

Update: Development on this project stopped in 2019 so this app should not be used without addressing dependencies. It's still a good pattern / blueprint for the execution of the idea and project. package.json / readme.md have been updated so the project actually runs but it needs to be hooked up to S3 infrastructure to save images so it's not 100% functional as-is.

** Run it locally: **

```
0. git clone https://github.com/dirtybirdnj/clipper-trace.git
1. npm install
2. knex migrate:latest
3. npm run start
```

**Relationships**

Event hasMany Image hasMany Trace

**MVP API Endpoints:**

*Working*

- [x] Create Event POST @ /events
- [x] List Events GET @ /events
- [x] Upload Image POST @ /images - pass event ID
- [x] List Images GET @ /events
- [x] Create Trace POST @ /traces - pass image ID

*In Progress*

Need to figure out the workflow of creating traces. Should the SVG data be stored or should the client manage that?
- [ ] Save Trace POST @ /images/id/trace

*To Do*

- [ ] Retrieve Image Traces GET @ /images/id/traces
- [ ] Finalize Image POST @ /images/id/finalize
- [ ] List events GET /events
- [ ] List event images GET @ /events/id/images
