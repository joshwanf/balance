import { useState } from "react"
import { TopBar } from "./TopBar"
import * as Btn from "../../lib/Base/Button"
import { useAppSelector } from "../../app/hooks"
import { AnimatePresence } from "motion/react"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { SignupForm } from "./SignupForm"
import { useNavigate } from "react-router"

interface Props {}
export const Landing: React.FC<Props> = props => {
  const navigate = useNavigate()
  const session = useAppSelector(state => state.session.user)
  const [display, setDisplay] = useState("")
  const url = session ? "my-balance" : ""

  const startBalancing = () => {
    if (session) {
      navigate("my-balance")
    } else {
      setDisplay("signup")
    }
  }
  return (
    <div className="bg-beige flex flex-col">
      <TopBar />
      {/* <div className="relative w-full h-screen bg-beige"> */}
      <div className="w-full bg-beige">
        <img
          src="images/hero.svg"
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
            <Btn.SecondaryButton
              onClick={startBalancing}
              className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition-all duration-1000"
            >
              Start Balancing
            </Btn.SecondaryButton>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-row justify-around bg-dark-beige rounded-b-3xl pb-4 px-6 text-slate-500"> */}
      <h1 className="text-4xl py-4 pl-4 bg-dark-beige text-slate-600">
        Why should you{" "}
        <span className="text-grass-500 bg-slate-700 px-4 py-2 rounded-lg">
          Balance
        </span>
        ?
      </h1>
      <div className="flex flex-row justify-around bg-gradient-to-b from-dark-beige to-beige pb-4 px-10 text-slate-600">
        <div className="py-10 w-1/3 text-2xl">
          <div className="text-xl">
            <p className="py-4">Custom Money class* with infix notation!</p>
            <ul className="py-4 list-disc list-inside">
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
            src="images/money-class.png"
            alt="Money class"
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="flex flex-row justify-around px-10 text-slate-600">
        <div className="self-center">
          <Btn.SecondaryButton
            onClick={startBalancing}
            className="inline-block px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition-all duration-1000"
          >
            Start Balancing
          </Btn.SecondaryButton>
        </div>
        <div className="p-10 w-1/3 text-2xl border-grass-300 border-4 bg-grass-50 rounded-xl">
          <div className="text-xl text-slate-600">
            <p className="py-4">This app is written in TypeScript!</p>
            <p className="py-4">for a much better... typing... experience...</p>
          </div>
        </div>
      </div>
      <div className="py-10"></div>
      <AnimatePresence>
        {display === "signup" && (
          <Modal
            selector="#authNode"
            closeModal={() => setDisplay("")}
            element={<SignupForm closeModal={() => setDisplay("")} />}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
