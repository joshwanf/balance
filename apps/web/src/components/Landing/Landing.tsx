import Link from "next/link"
import { TopBar } from "./TopBar"
import { Search } from "lucide-react"
import { getSessionUser } from "@/server/auth"
import { StartBalancingButton } from "@/components/Landing/StartBalancingButton"

export const Landing = async () => {
  const user = await getSessionUser()

  return (
    <div className="bg-beige flex flex-col">
      <TopBar />
      {/* <div className="relative w-full h-screen bg-beige"> */}
      <div className="w-full bg-beige">
        <img
          src="/assets/images/hero.svg"
          alt="Hero Image"
          className="inset-0 w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-start px-8 mt-[5%]">
          <div className="flex flex-col space-y-4 mt-[8%]  w-1/2">
            <h1 className="text-3xl lg:text-6xl text-grass">
              Find Your Balance
            </h1>
            <p className="text-lg text-waikawa-gray">
              Level with your money today
            </p>
          </div>
          <div className="mt-[10%]">
            {user ? (
              <Link
                href="/my-balance"
                className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition-all duration-1000"
              >
                My Balance
              </Link>
            ) : (
              <StartBalancingButton className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition-all duration-1000" />
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex flex-row justify-around bg-dark-beige rounded-b-3xl pb-4 px-6 text-slate-500"> */}
      <h1 className="text-4xl py-4 pl-4 bg-dark-beige text-slate-600">
        Why should you{" "}
        <span className="text-grass-500 bg-slate-700 px-4 py-2 mx-2 rounded-lg inline-block -skew-x-12">
          Balance
        </span>
        ?
      </h1>
      <div className="flex flex-row justify-around bg-gradient-to-b from-dark-beige to-beige pb-4 px-10 text-slate-600">
        <div className="py-10 w-1/3 text-2xl">
          <div className="text-xl">
            <p className="py-4">Custom Money class* with infix notation!</p>
            <ul className="py-4 list-disc list-inside leading-normal">
              <li>
                Safely pass strings from user input with{" "}
                <code className="bg-grass-500 px-2 py-0.5 rounded-lg text-grass-800">
                  Money.validate()
                </code>
              </li>
              <li>
                Naturally compare two Money values without breaking up the way
                you think:{" "}
                <code className="bg-grass-500 px-2 py-0.5 rounded-lg text-grass-800">
                  dinnerTab.gt(wallet)
                </code>
                ,{" "}
                <code className="bg-grass-500 px-2 py-0.5 rounded-lg text-grass-800">
                  withdrawal.lte(atmBalance)
                </code>
              </li>
            </ul>

            <p className="text-base">* only tested for what I need</p>
          </div>
        </div>
        <div className="w-1/2 py-10 drop-shadow-2xl">
          <img
            src="/assets/images/money-class.png"
            alt="Money class"
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="flex flex-row justify-around px-10 text-slate-600">
        <div className="p-10 w-1/2 text-2xl border-grass-300 bg-grass-100 rounded-xl drop-shadow-xl">
          <div className="text-xl text-slate-600">
            <div className="flex border-2 border-grass-600 rounded-lg p-2">
              <Search className="text-grass-600" />
              <input
                readOnly={true}
                className="bg-transparent text-base w-full focus:outline-none placeholder:text-grass-600"
                placeholder='endDate:2024-12-06 tags:"capstone, coffee"'
              />
            </div>
            <p className="py-4">Search! (lite)</p>
            <p className="py-4">
              A very primitive query language to quickly find transactions
            </p>
          </div>
        </div>
        <div className="p-10 w-1/3 text-2xl border-grass-300 bg-grass-100 rounded-xl drop-shadow-xl">
          <div className="text-xl text-slate-600">
            <p className="py-4">This app is written in TypeScript!</p>
            <p className="py-4">for a much better... typing... experience...</p>
          </div>
          <div className="self-center">
            {user ? (
              <Link
                href="/my-balance"
                className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition-all duration-1000 shadow-xl"
              >
                My Balance
              </Link>
            ) : (
              <StartBalancingButton className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition-all duration-1000 shadow-xl" />
            )}
          </div>
        </div>
      </div>
      <div className="py-10"></div>
    </div>
  )
}
