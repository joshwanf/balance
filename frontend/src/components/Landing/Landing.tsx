import { useState } from "react"
import { RootState } from "../../app/store"
import { TopBar } from "./TopBar"
import * as Btn from "../../lib/Base/Button"

interface Props {}
export const Landing: React.FC<Props> = props => {
  return (
    <div className="bg-beige">
      <TopBar />
      <div className="relative w-full h-screen bg-beige">
        <img
          src="images/hero.svg"
          alt="Hero Image"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col justify-start px-8">
          <div className="flex flex-col space-y-4 mt-[12%]  w-1/2">
            <h1 className="text-8xl text-grass">Find Your Balance</h1>
            <p className="text-lg text-waikawa-gray">
              Level with your money today
            </p>
          </div>

          <div className="mt-[10%]">
            <a
              href=""
              className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition"
            >
              Start balancing
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
