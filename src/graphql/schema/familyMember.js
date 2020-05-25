import gql from 'graphql-tag';

export const hospital = gql`
  query patientHospital {
    patientHospital {
      id
      name
      address
      contact
      googleReviewLink
    }
  }
`;

export const patientSubscription = gql`
  subscription {
    familyMember {
      id
      name
      icon
      color
      physician
      events {
        admittedAt
        preOpAt
        orAt
        recoveryAt
        ableToVisitAt
        dischargedAt
      }
    }
  }
`;

export default {
  hospital,
  patientSubscription
}
