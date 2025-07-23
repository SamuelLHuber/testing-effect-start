import { Profile } from "../components/Profile"
import Background from "./background.png"

export default function() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <Profile />
        <div className="card w-96 rounded-2xl bg-base-200 shadow-sm">
          <div className="card-body items-center">
            <div className="w-24 mask mask-circle">
              <img alt="Logo Icon" src="https://dtech.vision/icon.png" />
            </div>
            <div className="text-center mb-16 md:mb-32 text-6xl font-bold text-white text-shadow-lg/30">
              Mini App Analytics
            </div>

            <div className="mb-16 md:mb-32">
              <ul className="flex flex-col gap-2 text-xl items-center">
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 me-2 inline-block text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Customizable style templates
                  </span>
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 me-2 inline-block text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    High-resolution image generation
                  </span>
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 me-2 inline-block text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    High-resolution image generation
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col w-full max-w-md px-4">
              <div className="text-4xl text-center font-bold my-2 text-shadow-lg/30">
                5$ / month
              </div>
              <div className="text-l text-center my-2 text-shadow-lg/30">
                Buy 1, get 2 months free
              </div>
              <button className="btn btn-success rounded-2xl btn-lg w-full mt-4 text-lg font-semibold">
                Yes I want this!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
