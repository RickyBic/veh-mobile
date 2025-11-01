import { gql } from '@apollo/client';

// Mutations pour l'authentification
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      success
      message
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        mongoId
        email
        role
        firstName
        lastName
      }
      success
      message
    }
  }
`;

// Mutations pour la progression
export const CREATE_PROGRESS = gql`
  mutation CreateProgress($input: CreateProgressInput!) {
    createProgress(input: $input) {
      progress {
        mongoId
        scenarioId {
          mongoId
        }
        currentSceneId {
          mongoId
          title
          text
        }
      }
      success
      message
    }
  }
`;

export const UPDATE_PROGRESS = gql`
  mutation UpdateProgress($progressId: ID!, $input: UpdateProgressInput!) {
    updateProgress(progressId: $progressId, input: $input) {
      progress {
        mongoId
        currentSceneId {
          mongoId
          title
          text
        }
        progressPercentage
      }
      success
      message
    }
  }
`;

export const RECORD_PROGRESS = gql`
  mutation RecordProgress($input: RecordProgressInput!) {
    recordProgress(input: $input) {
      progress {
        mongoId
        currentSceneId {
          mongoId
          title
          text
        }
        isCompleted
      }
      success
      message
    }
  }
`;
