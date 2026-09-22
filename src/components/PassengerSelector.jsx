import { FiUsers } from "react-icons/fi";
export default function
 PassengerSelector({ value, onChange }) { 
    return <label className="passenger-field">
    <span>
        <FiUsers/> Passengers</span>
    <div className="passenger-stepper">
        <button type="button" onClick={() => onChange(Math.max(1, Number(value) - 1))} aria-label="Decrease passengers">-</button>
        <strong>{value}</strong>
        <button type="button" onClick={() => onChange(Math.min(6, Number(value) + 1))} aria-label="Increase passengers">+</button>
        </div></label>; 
        }
