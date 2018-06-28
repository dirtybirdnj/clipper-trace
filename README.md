# clipper-trace

Clipper-trace is a service designed to ingest bitmap image and produce contour traces of the image. These traces are stacked together to produce a unique and fun trace rendition of the original. In addition to tracing, the layers should be able to do boolean operations

This project is the spiritual successor of facetrace, and specifically designed to address the separation of concerns issues that plauged the original. This is the backend I would have built then if I knew what I do now.

**Relationships**

Event hasMany Image hasMany Trace

**MVP API Endpoints:**

1. Create Event POST @ /events
1. Upload Image POST @ /events/id/image
1. Get Trace POST @ /images/id/trace
1. Save Trace POST @ /images/id/trace - also includes save flag
1. Retrieve Image Traces GET @ /images/id/traces
1. Finalize Image POST @ /images/id/finalize
1. List events GET /events
1. List event images GET @ /events/id/images