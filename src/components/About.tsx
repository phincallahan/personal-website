import * as React from 'react';

const spotifyDiscoLink = "https://open.spotify.com/user/12141814312/playlist/38GqkAytTEqzeiycF2VlAM"

const links = [
    {
        name: "contact",
        link: "mail"
    },
    {
        name: "github",
        link: "https://github.com/phincallahan"
    },
    {
        name: "last.fm",
        link: "https://www.last.fm/user/caphine"
    },
    {
        name: "spotify",
        link: "https://open.spotify.com/user/12141814312"
    }
];

export const About = (props) => (
    <section className="about">
        <p>
            <b className="name"> Phineas Callahan </b>
            is a math major at <a href="carleton.edu">Carleton College</a>. He
            enjoys writing clean code, solving algorithmic problems, and jamming out
            to <a href={spotifyDiscoLink}>disco</a>.
        </p>

        <table className="links">
            <tbody>
                <tr>
                    <td><strong>links: </strong></td>
                    <td><ul>{
                        links.map(({ name, link }) => (
                            <li key={name}>
                                <a href={link}>{name}</a>
                            </li>
                        ))
                    }</ul></td>
                </tr>
            </tbody>
        </table>
    </section>
)
