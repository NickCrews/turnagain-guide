import Prose from "../prose";

export default function AboutPage() {
  return (
    <Prose>
      <h1> About</ h1>

      <h2>Goals</h2>

      <h3>Free and Open</h3>
      <p>
        This is your public land. Info on it should be public too.
        Discussion on how to improve it is welcome, and should be public.
        The source code is available on <a href="https://github.com/NickCrews/turnagain-guide-next">GitHub</a>.
      </p>

      <h3>Community Driven</h3>
      <p>
        Please get in touch at <em>nicholas.b.crews+turnagain.guide@gmail.com</em>.
        I would love corrections, suggestions, or to hear what has been
        working for you and what hasn&apos;t.
        The help of many will polish this to it&apos;s best version.
        Note that I reserve the right to make final decisions (for now)
      </p>

      <h3>Useful</h3>
      <p>
        Maps, descriptions, etc can actually help you plan a trip.
        eg where is good for a storm day? What are your exit options
        for high-avalanche danger day?
      </p>

      <h3>Digital-first</h3>
      <p>
        We can do better than book-only guidebooks.
        We have PDF export for offline use and printing, of course.
        But just as good is a website, allowing for
      </p>
      <ul>
        <li>search</li>
        <li>interactive maps</li>
        <li>links and external resources</li>
        <li>live conditions</li>
        <li>realtime corrections and updates</li>
        <li>etc.</li>
      </ul>

      <h2>License</h2>
      <p>Released into the public domain. All contributions are also public domain.</p>
    </Prose>
  );
}
