import React from 'react';
import { Query } from 'react-apollo';
import './HospitalInformation.css';
import { hospital } from '../../graphql/schema/familyMember';

export const getGMapsLink = (address) =>
  `https://www.google.com/maps/place/${(address || '').split(' ').join('+')}`;

export default () =>
  <Query query={hospital}>
    {({ data: {patientHospital : hospital} }) => hospital ? (
      <div className='HospitalInformation'>
        <p className='HospitalInformationTitle'>{hospital.name}</p>
        <div className='HospitalInformationActionBar'>
          {hospital.contact &&
            <a href={`tel:${hospital.contact}`} className='HospitalInformationButton'>
              <div className='HospitalInformationIcon'>
                <span className='material-icons'>phone</span>
              </div>
              <div>Call</div>
            </a>}
          {hospital.address &&
            <a
              href={getGMapsLink(hospital.address)}
              target='_blank'
              rel='noopener noreferrer'
              className='HospitalInformationButton'
            >
              <div className='HospitalInformationIcon'>
                <span className='material-icons'>directions</span>
              </div>
              <div>Directions</div>
            </a>
          }
        </div>
      </div>
    ) : null}
  </Query>;
