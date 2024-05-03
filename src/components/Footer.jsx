import axios from "axios"
import { useEffect, useState } from "react"

const Footer = () => {

    const [credits, setCredits] = useState('')

    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/DiegoG1019/DiegoG1019/main/info/SiteSignature.txt')
        .then((response) => {
            setCredits(response.data)
        }).catch((err) => {
            setCredits('GLV Softworks')
        })
    })

    return(
        <div className="Footer">
            <p>{credits}</p>
        </div>
    )
}

export default Footer;