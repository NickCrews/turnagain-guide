import Prose from "../prose";

export default function ResourcesPage() {
  return (
    <Prose>
      <h1>Resources</h1>

      <h2>Facebook Groups</h2>
      <p>
        The <a href="https://www.facebook.com/groups/583971298332539/">Alaska Backcountry Ski Addiction</a>{" "}
        Facebook group is a great place to ask questions, share photos, and find partners.
        It&apos;s probably the most active backcountry skiing group in Alaska.
      </p>
      <p>
        If you&apos;re a woman, a less gatekeepy and bro-y alternative is the
        {" "}<a href="https://www.facebook.com/groups/316805289670797">
          AK Chicks Who Backcountry Ski/Splitboard
        </a>{" "}
        Facebook group.
      </p>

      <h2>Mapping Software</h2>
      <p>
        This site does not try to be a full-featured mapping application.
        For that, I recommend something like
        {" "}<a href="https://www.gaiagps.com/">GaiaGPS</a>,{" "}
        <a href="https://www.onxmaps.com/">onX Maps</a>,{" "}
        or <a href="https://caltopo.com/">CalTopo</a>.
        All of these support importing maps data, and this site provides downloadable
        {" "} <a href="/turnagain-pass.geojson" download>GeoJSON</a> and
        {" "} <a href="/turnagain-pass.gpx" download>GPX</a> files for that purpose.
        These files contain all routes, areas, and points of interest shown on this site.
      </p>

      <h2>Strava Heatmap</h2>
      <p>
        Use the <a href="https://www.strava.com/maps/global-heatmap?sport=WinterLike&style=winter&terrain=true&labels=true&poi=false&cPhotos=false&gColor=orange&gOpacity=100#9.83/60.7484/-149.1691">Strava Global Heatmap</a> to find where people commonly go.
        Even if people are secretive about their favorite spots, they still post their tracks to Strava.
        If you use GaiaGPS, you can add the Strava Heatmap as a layer
        by following <a href="https://gist.github.com/NickCrews/bdd7dc9d5d82003611dce0932a202644">this tutorial</a>.
      </p>

      <h2>Stores</h2>
      <ul>
        <li>
          <a href="https://www.alaskamountaineering.com/">AMH</a> is a locally owned outdoor store in Anchorage.
          It has a comparable/better selection than REI, especially for sepcialty and technical gear.
        </li>
        <li>
          <a href="https://www.rei.com/stores/anchorage.html">REI</a> is a national outdoor store with a location in Anchorage.
        </li>
        <li>
          <a href="https://www.hoardingmarmot.com/">Hoarding Marmot</a> is a consignment store in Anchorage offering new and used technical gear.
        </li>
        <li>
          <a href="https://www.powderhoundak.com/">Powder Hound Ski Shop</a> is a ski shop in Girdwood.
          They are a little more resort-oriented (since they are at the base of Alyeska),
          so they don&apos;t have as wide of a selection of backcountry gear (eg skins)
          as AMH, but otherwise are great.
        </li>
      </ul>

      <h2>Guide Services and Courses</h2>
      <p>Do you see someone missing? Contact me to add them!</p>
      <ul>
        <li>
          <a href="https://www.alaskaguidecollective.com/">Alaska Guide Collective</a> is a guild of AMGA guides in Alaska.
          They often offer avalanche courses.
        </li>
        <li>
          <a href="https://remarkableadv.com/">Remarkable Adventures</a> is a guide service based in Girdwood
          ran by AMGA Certified Ski Guide Nick D&apos;Alessio.
        </li>
        <li>
          <a href="https://www.stockalpine.com/">Joe Stock</a> is an IFMGA Mountain Guide based in Anchorage.
        </li>
        <li>
          <a href="https://elliotgaddy.com/">Elliot Gaddy</a> is an IFMGA Mountain Guide based in Anchorage.
        </li>
      </ul>
    </Prose>
  );
}
