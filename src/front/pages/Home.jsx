import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


import { Tienda } from "./Tienda";


export const Home = () => {
    const { store, dispatch } = useGlobalReducer()
    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")
            const response = await fetch(backendUrl + "/api/hello");
            const data = await response.json()
            if (response.ok) dispatch({ type: "set_hello", payload: data.message })
            return data
        } catch (error) {
            if (error.message) throw new Error(
                `Could not fetch the message from the backend.
                Please check if the backend is running and the backend port is public.`
            );
        }
    }
    useEffect(() => {
        loadMessage()
    }, [])



    return (

        <div
            id="carouselExample"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="5000" // cambia cada 5 segundos
            style={{ width: "1920px", height: "800px", margin: "0 auto" }}
        >
            <div className="carousel-inner h-100">
                <div className="carousel-item h-100">
                    <img
                        src="https://i.imgur.com/aput3Nu.jpeg"
                        className="d-block w-100 h-100"
                        alt="Imagen 2"
                        style={{ objectFit: "fill" }}
                    />


                </div>

                <div className="carousel-item active h-100">
                    <img
                        src="https://i.imgur.com/g0G6oFr.jpeg"
                        className="d-block w-100 h-100"
                        alt="Imagen 1"
                        style={{ objectFit: "fill" }}
                    />
                </div>
                <div className="carousel-item h-100">
                    <img
                        src="https://i.imgur.com/iXYjxBI.jpeg"
                        className="d-block w-100 h-100"
                        alt="Imagen 3"
                        style={{ objectFit: "cover" }}
                    />
                </div>

            </div>

            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>


            <Tienda />
        </div>

    );
};