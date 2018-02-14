import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

const Rating = (props) => {
  return (
              <div>
                <StarRatingComponent
                  name={props.productname + ' Rating'}
                  starColor='#F60437'
                  emptyStarColor='#000'
                  editing={false}
                  starCount={5}
                  value={props.rating}
                  renderStarIcon={(indexT, valueT) => {return <span className={indexT <= valueT ? 'fa fa-star' : 'fa fa-star-o'} />;
                  }}
                  renderStarIconHalf={() => <span className='fa fa-star-half-full' />} />
              </div>
        );
};

export default Rating;
