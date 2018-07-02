# clipper-trace

Clipper-trace is a service designed to ingest bitmap image and produce contour traces of the image. These traces are stacked together to produce a unique and fun trace rendition of the original. In addition to tracing, the layers should be able to do boolean operations

This project is the spiritual successor of facetrace, and specifically designed to address the separation of concerns issues that plauged the original. This is the backend I would have built then if I knew what I do now.

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
