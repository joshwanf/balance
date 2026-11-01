import Link from "next/link"
import { TopBar } from "./TopBar"
import { Search } from "lucide-react"
import { getSessionUser } from "@/server/auth"
import { StartBalancingButton } from "@/components/Landing/StartBalancingButton"

export const Landing = async () => {
  const user = await getSessionUser()

  return (
    <div className="bg-paper flex flex-col">
      <TopBar />
      {/* <div className="relative w-full h-screen bg-paper"> */}
      {/* Phones stack the headline above the hero image; from md it sits on top */}
      <div className="w-full bg-paper flex flex-col">
        <img
          src="/assets/images/hero.svg"
          alt="Hero Image"
          className="inset-0 w-full object-cover"
        />
        <div className="max-md:order-first flex flex-col justify-start px-6 pt-4 pb-8 md:absolute md:inset-0 md:px-8 md:pt-0 md:pb-0 md:mt-[5%]">
          <div className="flex flex-col space-y-4 md:mt-[8%] md:w-1/2">
            <h1 className="text-4xl lg:text-6xl">
              Find Your Balance
            </h1>
            <p className="text-lg text-neutral-500">
              Level with your money today
            </p>
          </div>
          <div className="mt-6 md:mt-[10%]">
            {user ? (
              <Link
                href="/my-balance"
                className="inline-block px-6 py-2 bg-neutral-500 text-surface rounded-lg hover:bg-neutral-900 transition-all duration-1000"
              >
                My Balance
              </Link>
            ) : (
              <StartBalancingButton className="inline-block px-6 py-2 bg-neutral-500 text-surface rounded-lg hover:bg-neutral-900 transition-all duration-1000" />
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex flex-row justify-around bg-paper-strong rounded-b-3xl pb-4 px-6 text-neutral-500"> */}
      <h1 className="text-3xl md:text-4xl py-4 px-4 bg-paper-strong text-neutral-600">
        Why should you{" "}
        <span className="text-brand-500 bg-neutral-700 px-4 py-2 mx-2 rounded-lg inline-block -skew-x-12">
          Balance
        </span>
        ?
      </h1>
      <div className="flex flex-col lg:flex-row justify-around bg-gradient-to-b from-paper-strong to-paper pb-4 px-6 md:px-10 text-neutral-600">
        <div className="py-6 lg:py-10 lg:w-1/3 text-2xl">
          <div className="text-xl">
            <p className="py-4">Custom Money class* with infix notation!</p>
            <ul className="py-4 list-disc list-inside leading-normal">
              <li>
                Safely pass strings from user input with{" "}
                <code className="bg-brand-500 px-2 py-0.5 rounded-lg text-brand-800 [overflow-wrap:anywhere]">
                  Money.validate()
                </code>
              </li>
              <li>
                Naturally compare two Money values without breaking up the way
                you think:{" "}
                <code className="bg-brand-500 px-2 py-0.5 rounded-lg text-brand-800 [overflow-wrap:anywhere]">
                  dinnerTab.gt(wallet)
                </code>
                ,{" "}
                <code className="bg-brand-500 px-2 py-0.5 rounded-lg text-brand-800 [overflow-wrap:anywhere]">
                  withdrawal.lte(atmBalance)
                </code>
              </li>
            </ul>

            <p className="text-base">* only tested for what I need</p>
          </div>
        </div>
        <div className="lg:w-1/2 py-4 lg:py-10 drop-shadow-2xl">
          <img
            src="/assets/images/money-class.png"
            alt="Money class"
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 justify-around px-6 md:px-10 text-neutral-600">
        <div className="p-6 lg:p-10 lg:w-1/2 text-2xl border-brand-300 bg-brand-100 rounded-xl drop-shadow-xl">
          <div className="text-xl text-neutral-600">
            <div className="flex border-2 border-brand-600 rounded-lg p-2">
              <Search className="shrink-0 text-brand-600" />
              <input
                readOnly={true}
                className="bg-transparent text-sm md:text-base w-full min-w-0 focus:outline-none placeholder:text-brand-600"
                placeholder='endDate:2024-12-06 tags:"capstone, coffee"'
              />
            </div>
            <p className="py-4">Search! (lite)</p>
            <p className="py-4">
              A very primitive query language to quickly find transactions
            </p>
          </div>
        </div>
        <div className="p-6 lg:p-10 lg:w-1/3 text-2xl border-brand-300 bg-brand-100 rounded-xl drop-shadow-xl">
          <div className="text-xl text-neutral-600">
            <p className="py-4">This app is written in TypeScript!</p>
            <p className="py-4">for a much better... typing... experience...</p>
          </div>
          <div className="self-center">
            {user ? (
              <Link
                href="/my-balance"
                className="inline-block px-6 py-2 bg-neutral-500 text-surface rounded-lg hover:bg-neutral-900 transition-all duration-1000 shadow-xl"
              >
                My Balance
              </Link>
            ) : (
              <StartBalancingButton className="inline-block px-6 py-2 bg-neutral-500 text-surface rounded-lg hover:bg-neutral-900 transition-all duration-1000 shadow-xl" />
            )}
          </div>
        </div>
      </div>
      <div className="py-10"></div>
    </div>
  )
}
