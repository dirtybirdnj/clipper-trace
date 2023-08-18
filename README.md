# clipper-trace


Clipper-trace is a service designed to ingest bitmap image and produce contour traces of the image. These traces are stacked together to produce a unique and fun trace rendition of the original. In addition to tracing, the layers should be able to do boolean operations

This project allows you to create events, and then upload images and associate them with the event. Each image then can have traces generated, and the traces can be output as a single SVG with an endpoint.

This project exposes a prototype UI which is not functional, but gives an idea of what the experience should be. The app is desigend to automate the process, but you still need some human intervention to ajust settings and this type of visual interface is essential for good final output.

This project is the spiritual successor of [facetrace](https://github.com/dirtybirdnj/facetrace), and specifically designed to address the separation of concerns issues that plauged the original. This is the backend I would have built then if I knew what I do now. I have rebuilt the facetrace UI at least once, and after doing that it was clear that I needed a backend to properly handle the event driven architrecture of the "robot draws you" magic. The ultimate goal is push button, camera fires, robot starts drawing without any human intervention. The pieces are here in this repo, it just needs time and energy to assemble the kit.

Update: Development on this project stopped in 2019 so this app should not be used without addressing dependencies. It's still a good pattern / blueprint for the execution of the idea and project. package.json / readme.md have been updated so the project actually runs but it needs to be hooked up to S3 infrastructure to save images so it's not 100% functional as-is.

## Run it locally:

```
0. git clone https://github.com/dirtybirdnj/clipper-trace.git
1. npm install
2. knex migrate:latest
3. npm run start
```
<img width="579" alt="Screen Shot 2023-08-18 at 9 54 58 AM" src="https://github.com/dirtybirdnj/clipper-trace/assets/419961/2c65f8c7-ce40-472c-848d-1c202061d064">

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
