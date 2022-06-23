import { Button } from 'primereact/button';
import React from 'react';

export const Ad: React.FC = () => {
    return (
        <div className='ad justify-content-center' style={{ 
            background: 'url(/assets/img/header-branding.jpg)', 
            backgroundSize: 'cover', 
            padding: 0
        }}>
            <div style={{ 
                background: 'rgba(36, 48, 94, .6)',
                padding: '1.25rem'
                // display: 'flex',
                // justifyContent: 'center'
            }}>
                <h2 className='display-4 text-white'>Get your ad here!</h2>
                <p className='lead text-white'>Be seen by thousands of Icelandic Horse interested people!</p>
                <div className='d-flex align-items-center'>
                    <Button label="Get in touch" className='p-button-rounded register-button' style={{ fontSize: "1.2rem"}} onClick={() => {
                        window.location.href = 'mailto:andreas@hejndorf-foto.dk'
                    }} />
                    <small className='ml-3 text-white'>or write an email to <a className='text-white' href="mailto:andreas@hejndorf-foto.dk">andreas@hejndorf-foto.dk</a></small>
                </div>
            </div>
        </div>
    )
}