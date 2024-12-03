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
      {/* <div className="bg-dark-beige rounded-b-3xl pb-4 px-6 text-slate-500">
        <h1 className="text-4xl">Why should you Balance?</h1>
        <div>Custom Money class</div>
      </div>
      <div className="mt-8 mx-8 p-6 rounded-xl bg-white">Reason 2</div> */}
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
