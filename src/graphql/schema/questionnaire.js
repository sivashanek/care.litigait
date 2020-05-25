import gql from 'graphql-tag';

export const questionnaireAnswers = gql`
  query questionnaireAnswers($id: Long!) {
    questionnaireAnswers(id: $id) {
      id
      questions
      answers
      submittedAt
    }
  }
`;

export const myQuestionnaireAnswers = gql`
  query myQuestionnaireAnswers {
    myQuestionnaireAnswers {
      id
      questions
      answers
      submittedAt
    }
  }
`;

export const submitQuestionnaireAnswers = gql`
  mutation submitQuestionnaireAnswers($answers: String!) {
    submitQuestionnaireAnswers(answers: $answers) {
      id
      questions
      answers
      submittedAt
    }
  }
`;

export const editQuestionnaireAnswers = gql`
  mutation editQuestionnaireAnswers($id: Long!, $answers: String!) {
    editQuestionnaireAnswers(id: $id, answers: $answers) {
      id
      questions
      answers
      submittedAt
    }
  }
`;

export const requestAuthenticationCode = gql`
  mutation requestAuthenticationCode {
    requestAuthenticationCode {
      status
      phoneNumbers
      session {
        token
        validUntil
      }
    }
  }
`;

export const verifyAuthenticationCode = gql`
  mutation verifyAuthenticationCode($token: String!) {
    verifyAuthenticationCode(token: $token) {
      token
      validUntil
    }
  }
`;

export const extendAuthenticationCode = gql`
  mutation extendAuthenticationCode($token: String!) {
    extendAuthenticationCode(token: $token) {
      token
      validUntil
    }
  }
`;

export const getSurgeryInstructions = gql`
  query surgeryInstructions {
    surgeryInstructions
    myInstructionAcceptance 
  }
`;


export const getPastSurgeryInstructions = gql`
  query pastSurgeryInstructions($id: Long!, $version: Long) {
    surgeryInstructions: pastSurgeryInstructions(id: $id, version: $version)     
  }
`;

export const acceptSurgeryInstructions = gql`
  mutation acceptSurgeryInstructions($content: String!) {
    acceptSurgeryInstructions(content: $content)
  }
`;

export default {
  myQuestionnaireAnswers,
  submitQuestionnaireAnswers,
  getSurgeryInstructions,
  acceptSurgeryInstructions
};
