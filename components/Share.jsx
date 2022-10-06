import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faLinkedin, faLinkedinIn, faTwitter, faWhatsapp} from "@fortawesome/free-brands-svg-icons";

import "./Share.scss";
import {Link} from "react-router-dom";
import {Icon} from "@blueprintjs/core";
import {OutboundLink} from "react-ga";

export default function Share(props) {
  const URL = "https://abc.com.py/asuprioriza/";
  const TEXT = "¿En qué estamos de acuerdo y en qué no cuando hablamos de las prioridades de Asunción?.";
  const HASHTAG = "ABCAsuPrioriza,Elecciones2021";
  const TITLE = "AsuPrioriza";
  const TEXT_URL = `${TEXT} Elegí las tuyas en ${URL}`;

  const {callback, embed} = props;

  const icons = <div className="icons">
    <OutboundLink 
      className="icon facebook" 
      eventLabel="Facebook / Share"
      target="_blank" 
      to={`https://www.facebook.com/sharer/sharer.php?u=${URL}&quote=${TEXT}`} 
      rel="noreferrer"
    >
      <FontAwesomeIcon icon={faFacebookF} />
    </OutboundLink>
    <OutboundLink 
      className="icon twitter" 
      eventLabel="Twitter / Share"
      target="_blank" 
      to={`http://twitter.com/share?text=${TEXT}&url=${URL}&hashtags=${HASHTAG}`} 
      rel="noreferrer"
    >
      <FontAwesomeIcon icon={faTwitter} />
    </OutboundLink>
    <OutboundLink 
      className="icon whatsapp" 
      eventLabel="WhatsApp / Share"
      target="_blank" 
      to={`https://wa.me/?text=${TEXT_URL}`} 
      rel="noreferrer"
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </OutboundLink>
    <OutboundLink 
      className="icon linkedin" 
      eventLabel="LinkedIn / Share"
      rel="noreferrer"
      target="_blank" 
      to={`https://www.linkedin.com/sharing/share-offsite/?url=${URL}&title=${TITLE}&summary=${TEXT}&source=AsuPrioriza`} 
    >
      <FontAwesomeIcon icon={faLinkedinIn} />
    </OutboundLink>
  </div>;

  if (embed) {
    return <div className="card-container share embed">
      {icons}
    </div>;
  }

  return <div className="card-container share">
    <div className="head">
      <h6 className="title">¡Gracias por participar!</h6>
      <h3>¡Ayúdanos a llegar a más participantes compartiendo con tus amigos!</h3>
    </div>
    {icons}
    <div>
      <Link className="card-button" onClick={() => callback({isOpenShare: false})}>
      Seguir participando <Icon icon="chevron-right" />
      </Link>
    </div>
  </div>;
}