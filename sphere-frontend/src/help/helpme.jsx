import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const HelpMe = () => {


    return (
        <div className="h-screen relative lg:overflow-hidden">
            <div className="flex flex-row justify-between py-6 max-w-full mx-auto lg:px-20 px-5 items-center">

                <Link to={"/"} className="text-4xl font-semibold text-white">Sphere</Link>
                <Link to={"/signup"} className="underline text-md text-white">Go to signup page</Link>
            </div>
            <h1 className="text-center text-2xl my-10 text-primary">
                Advise and answers from the Sphere team
            </h1>
            <div className="my-10 flex justify-center">
                <form className="flex flex-row items-center">
                    <label htmlFor="helpbox"></label>
                    <input className="bg-secondary w-[55rem] h-[4rem] p-5 rounded-l-xl outline-none"
                        type="text"
                        id="searchbox"
                        placeholder="Search your need here"
                    />
                    <div className="bg-secondary h-[4rem] p-5 rounded-r-xl w-[4rem]">
                        <Search className=" text-gray-800 cursor-pointer" />
                    </div>
                </form>
            </div>
            <div className="flex flex-row justify-center items-center">
                <h2 className="text-lg mr-4 underline text-white">Beginner's Guide</h2>
                <div className="h-[10px] w-[10px] rounded-full bg-primary"></div>
                <Link className="text-lg ml-4 underline text-white">Contact Us</Link>
            </div>
            <div className="mt-10 flex justify-center">
                <div className="bg-secondary w-[90rem] rounded-xl p-10 overflow-auto">
                    <ol className="list-decimal space-y-6 pl-5 text-neutral-700">
                        <li>
                                <p className="text-left font-semibold text-xl mb-3 ml-2">What is sphere?</p>
                                <p className="text-lg">Sphre is a chat application,designed for realtime communication between clients</p>
                        </li>
                        <hr className="mt-3 border-t border-gray-300"></hr>
                         <li>
                                <p className="text-left font-semibold text-xl mb-3 ml-2">How does Sphere ensure real-time communication?</p>
                                <p className="text-lg">Sphere uses WebSocket technology to maintain a constant connection between the client and server,enabling instant message delivery.</p>
                        </li>
                        <hr className="mt-3 border-t border-gray-300"></hr>
                         <li>
                                <p className="text-left font-semibold text-xl mb-3 ml-2"> Is Sphere available on mobile devices?</p>
                                <p className="text-lg">Absolutely. Sphere supports both Android and iOS platforms, providing a seamless mobile experience.</p>
                        </li>
                        <hr className="mt-3 border-t border-gray-300"></hr>
                         <li>
                                <p className="text-left font-semibold text-xl mb-3 ml-2">Is communication in Sphere encrypted?</p>
                                <p className="text-lg">Sphere uses end-to-end encryption to protect user conversations and ensure data privacy.</p>
                        </li>
                        <hr className="mt-3 border-t border-gray-300"></hr>
                    </ol>
                </div>
            </div>
            <div className="flex flex-row gap-3 justify-center items-center mt-5">
                <p className="text-2xl font-semibold text-primary">Sphere</p>
                <p className="text-2xl text-textcolor">|</p>
                <p className="text-xl text-neutral-600 text-secondary">Help</p>
            </div>
        </div>
    )
}

export default HelpMe;