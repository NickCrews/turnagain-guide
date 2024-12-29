import Map from "./components/map";

export default function Home() {
  return (
    <>  
        <link rel="stylesheet" href="Cesium/Widgets/widgets.css" />
        <Map geojson={"/objects.geojson"}/>
    </>
  );
}
