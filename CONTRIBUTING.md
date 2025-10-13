# Contributing
## Setup
1. Copy the `example.env` to another file called `.env`. 
2. Either get a Cesium api key from another developer or make a free account with Cesium to get an api key. 
Paste the API key into the variable for the cesium api key.
3. Run 
```bash
pnpm install
```
and 

```bash
pnpm dev
```

4. Open [http://localhost:1337](http://localhost:1337) with your browser to see the result.

## Development Notes
- Run `pnpm lint` before committing to ensure you are not inadvertantly introducing code with linting errors. 
- Run all images through https://squoosh.app to make them smaller before committing them to the git repo.
