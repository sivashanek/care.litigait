import gql from 'graphql-tag';

export const myFeedback = gql`
  query myFeedback {
    myFeedback {
      id
      rating
      suggestion
      submittedAt
    }
    
    patientHospital {
      googleReviewLink
      name
    }
  }
`;

export const submitFeedback = gql`
  mutation submitFeedback($rating: Int!, $suggestion: String) {
    submitFeedback(rating: $rating, suggestion: $suggestion) {
      id
      rating
      suggestion
      submittedAt
    }
  }
`;

export default {
  myFeedback,
  submitFeedback
};
