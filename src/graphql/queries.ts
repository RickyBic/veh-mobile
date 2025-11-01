import { gql } from '@apollo/client';

// Queries pour les utilisateurs
export const GET_ME = gql`
  query GetMe {
    me {
      mongoId
      email
      role
      firstName
      lastName
    }
  }
`;

// Queries pour les scénarios
export const GET_ALL_SCENARIOS = gql`
  query GetAllScenarios($publishedOnly: Boolean) {
    allScenarios(publishedOnly: $publishedOnly) {
      mongoId
      title
      description
      isPublished
      createdAt
    }
  }
`;

export const GET_SCENARIO = gql`
  query GetScenario($scenarioId: ID!) {
    scenarioById(scenarioId: $scenarioId) {
      mongoId
      title
      description
      isPublished
    }
  }
`;

export const GET_SCENARIO_WITH_SCENES = gql`
  query GetScenarioWithScenes($scenarioId: ID!) {
    scenarioById(scenarioId: $scenarioId) {
      mongoId
      title
      description
      isPublished
      scenes {
        mongoId
        title
        text
        order
        isStartScene
        isEndScene
      }
    }
  }
`;

export const GET_SCENES_BY_SCENARIO = gql`
  query GetScenesByScenario($scenarioId: ID!) {
    scenesByScenario(scenarioId: $scenarioId) {
      mongoId
      title
      text
      order
      isStartScene
      isEndScene
      imageId {
        mongoId
        url
      }
      soundId {
        mongoId
        url
      }
      musicId {
        mongoId
        url
      }
    }
  }
`;

export const GET_CHOICES_BY_SCENE = gql`
  query GetChoicesByScene($sceneId: ID!) {
    choicesByScene(sceneId: $sceneId) {
      mongoId
      text
      order
      toSceneId {
        mongoId
      }
    }
  }
`;

export const GET_SCENE = gql`
  query GetScene($sceneId: ID!) {
    sceneById(sceneId: $sceneId) {
      mongoId
      title
      text
      order
      isStartScene
      isEndScene
      imageId {
        mongoId
        url
        name
      }
      soundId {
        mongoId
        url
        name
      }
      musicId {
        mongoId
        url
        name
      }
      choices {
        mongoId
        text
        order
        toSceneId {
          mongoId
        }
      }
    }
  }
`;

// Queries pour la progression
export const GET_MY_PROGRESS = gql`
  query GetMyProgress {
    myProgress {
      mongoId
      scenarioId {
        mongoId
        title
        description
      }
      currentSceneId {
        mongoId
        title
        text
      }
      isCompleted
      progressPercentage
      totalTimeSpent
    }
  }
`;

export const GET_PROGRESS_BY_SCENARIO = gql`
  query GetProgressByScenario($userId: ID!, $scenarioId: ID!) {
    progressByUserAndScenario(userId: $userId, scenarioId: $scenarioId) {
      mongoId
      currentSceneId {
        mongoId
      }
      isCompleted
      progressPercentage
      history {
        sceneId {
          mongoId
        }
        timestamp
      }
    }
  }
`;

// Queries pour l'inventaire (assets)
export const GET_MY_ASSETS = gql`
  query GetMyAssets {
    myAssets {
      mongoId
      name
      type
      url
      metadata
    }
  }
`;
