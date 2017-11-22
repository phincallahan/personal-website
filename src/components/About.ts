import * as m from 'mithril';

const discoLink = "https://open.spotify.com/user/12141814312/playlist/38GqkAytTEqzeiycF2VlAM"
const links = [
    { name: "contact", link: "mail" },
    { name: "github", link: "https://github.com/phincallahan" },
    { name: "last.fm", link: "https://www.last.fm/user/caphine" },
    { name: "spotify", link: "https://open.spotify.com/user/12141814312" }
]

const node = m.trust(
    `<section id="about">
        <p>
            <b class="name">Phineas Callahan</b> is a math major at 
            <a href="carleton.edu">Carleton College</a>. He enjoys writing clean
            code, solving algorithmic problems, and jamming out to 
            <a href="${discoLink}">disco</a>.
        </p>

        <table class="links">
            <tbody>
                <tr>
                    <td><strong>links: </strong></td>
                    <td><ul>${
    links.map(({ name, link }) => (
        `<li><a href=${link}>${name}</a></li>`
    )).join('')
    }</ul></td>
                </tr>
            </tbody>
        </table>
    </section>`
);

export const About: m.Component = { view: () => node }