import Intro from "./intro";

export default function Home() {
  return (
    <>
      <h1
        className="col-start-2 font-mdNichrome font-bold mb-8 mt-0 text-5xl w-full sm:text-5xl"
        data-line="slim"
      >
        Bookmarks (Reloaded)
      </h1>
      <div className="flex items-center justify-between w-full">
      </div>
      <Intro />
    </>
  );
}
