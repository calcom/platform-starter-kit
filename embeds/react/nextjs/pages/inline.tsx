import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <Cal calLink='hariom' config={{
		layout:'column_view'
	}} />
  )
}