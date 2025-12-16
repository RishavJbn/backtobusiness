

function Hero() {
  return (
    <div className="flex gap-4 justify-between items-center m-8 p-8">
      <div className="w-[50%] bg-blue-100 rounded-3xl p-4">
        <h1 className="text-5xl font-bold text-blue-700">
          Hi , I am Rishav Singh
        </h1>
        <span className="text-4xl font-bold  text-blue-600 pb-4">
          Software Engineer <br />{" "}
        </span>
        <span className="px-8 text-xl text-blue-500 leading-tight">
          I am an aspiring software engineer with a strong foundation in C++ and
          Data Structures & Algorithms. I am learning and building projects
          using the MERN stack while focusing on writing clean, efficient code.
          I am passionate about continuous learning and seeking an entry-level
          role to grow and contribute in a collaborative environment.
        </span>
        <div className="flex gap-4 mt-4 p-4 ">
          <button className="bg-blue-500 text-white px-2  rounded-xl hover:bg-blue-600">
            Hire Me
          </button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-xl hover:bg-blue-600">
            Contact Me
          </button>
        </div>
      </div>
      <div>
        <img src="../public/anime-pfp.png" alt="" />
      </div>
    </div>
  );
}

export default Hero