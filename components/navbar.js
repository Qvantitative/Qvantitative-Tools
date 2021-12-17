import React from "react";
import Link from 'next/link'

const Navbar = ({ history }) => {
  return (
      <div>
        <ul>
            <li>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
        </ul>
      </div>
  );
};

export default (Navbar);