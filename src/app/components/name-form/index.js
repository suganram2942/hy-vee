"use client";
import React, { useState } from 'react'

const NameComponent = () => {
    const [name, setName] = useState('');
    const [detail, setDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const getName = async (name) => {
        
        const response = await fetch(`https://api.agify.io/?name=${name}`)
        return response;
    }

    const getCountry = async (name) => {
        
        const response = await fetch(`https://api.nationalize.io/?name=${name}`)
        return response;
    }

    const getGender = async (name) => {
        
        const response = await fetch(`https://api.genderize.io/?name=${name}`)
        return response;
    }

    const getDetails = async (name) => {
        setIsLoading(true);
        try {
            const responses = await Promise.all([getName(name), getCountry(name), getGender(name)]);
            let results = []
            let details = {}

            for (const response of responses) {
                const jsonObject = await response.json();
                results.push(jsonObject);
            }

            details.name = results[0]?.name;
            details.country = results[1]?.country?.map((country) => country?.country_id)
            details.gender = results[2]?.gender;
            if (!isEmpty(details)) {
                setDetail(details)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name?.trim()) return
        getDetails(name)
        setName('')
    }

    const handleChangeName = (e) => {
        setName(e.target.value)
    }

    const handleReset = () => {
        setName('');
        setDetail(null);
    }
    return (
        <div className='center-container'>
            <div className='title'>Hy-Vee Application</div>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <input type='text'
                        className='input-component'
                        value={name}
                        onChange={handleChangeName}
                        placeholder='Enter name' />
                    <div className="button-group">
                        <button
                            className='button-component submit'
                            type='submit'>Submit</button>
                        <button
                            className='button-component reset'
                            type='button'
                            onClick={handleReset}>Reset</button>
                    </div>
                </form>
                {isLoading && <div className='loader'></div>}
                {detail &&
                    <div className='result'>
                        <p><span className="label">Name:</span> {detail?.name}</p>
                        <p><span className="label">Gender:</span> {detail?.gender}</p>
                        <p><span className="label">Country:</span> {detail?.country?.join(", ")}</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default NameComponent