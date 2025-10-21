import React from "react";
import { Logo } from "../Logo";

export const Footer = () => {
  return (
    <footer className="footer footer-start p-10 bg-gray-700 text-neutral-content flex items-start flex-col h-max">
      <div className="flex w-full justify-center">
        <aside>
          <Logo />
          <div className="flex flex-col gap-4">
            <p className="text-lg">YourNextStay Ltd.</p>
            <div>
              <p className="text-lg">Providing reliable tech. 2025</p>
            </div>
          </div>
        </aside>
        <div className="flex w-[70%] justify-around text-lg">
          <nav className="flex flex-col">
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav>
          <nav className="flex flex-col">
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav>
          <nav className="flex flex-col">
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </nav>
        </div>
      </div>
      <nav className="w-full flex items-center justify-center">
        <div className="grid grid-flow-col gap-4">
          <h6 className="footer-title">Social</h6>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.596-5.515 5.824 0 .454.052.9.152 1.337-4.38-.22-8.28-2.32-10.89-5.524-.453.775-.71 1.69-.71 2.663 0 2.02.998 3.803 2.545 4.84-1.007-.033-1.95-.32-2.78-.78v.08c0 2.82 2.003 5.17 4.65 5.7-.48.13-.99.2-1.52.2-.37 0-.74-.04-1.1-.1 0 .74.29 1.46.81 2.05.62.72 1.43.18 2.39.18-2.09 1.64-4.73 2.62-7.6 2.62-.5 0-1-.03-1.5-.09C2.6 20.4 5.1 21.5 7.9 21.5c9.4 0 14.6-7.8 14.6-14.6v-.66c1-.72 1.8-1.6 2.5-2.7Z" />
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816Zm-10.615 12.816V8l8 4-8 4Z" />
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385Z" />
            </svg>
          </a>
        </div>
        <div className="text-5xl font-thin mb-2">{" | "}</div>
        <div>
          <p className="text-lg">Made with ❤️ by Mark</p>
        </div>
      </nav>
    </footer>
  );
};
