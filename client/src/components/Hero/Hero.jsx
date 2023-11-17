import { Carousel } from 'react-bootstrap';
import ExampleCarouselImage from '../Banners/ExampleCarouselmage';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/products/get/featured/`)
      .then(response => response.json())
      .then(json => setFeatured(json))
      .catch(error => console.error(error));
  }, []);
  return (
    <div className='w-screen h-fit'>
      <Carousel>
      {
        featured.map((feat)=>{
          return (
            <Carousel.Item key={feat._id}>
              <ExampleCarouselImage text="First slide" image={feat.image}/>
              <Carousel.Caption>
                <h3>{feat.name}</h3>
                <p>{feat.richDescription}</p>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })
      } 
      </Carousel>
    </div>
  )
}

export default Hero;
