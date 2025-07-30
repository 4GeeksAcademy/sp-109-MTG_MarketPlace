import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Form from "../components/Form.jsx";
import Data from "../components/Data.jsx";

export const Home = () => {

	const handleProductAdded = () => {
		setReload(!reload);
	};


	return (
		<>
			<div className="text-center mt-5">
				<h1 className="display-4">MTG Marketplace</h1>
				
				<Data />


			</div>

		</>
	);
}; 