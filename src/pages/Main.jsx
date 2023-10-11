import {
  Box,
  Heading,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import * as api from "strateegia-api";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";
import DivPointList from "../components/DivPointList";
import { i18n } from "../translate/i18n";
import { executeCalculations, getMeanForAllDivPoints } from "../components/metrics";
import UserTable from "../components/UserTable";
import { ExportsButtons } from "../components/ExportsButtons";
import { generateDocument } from "../components/FileContent";

export default function Main() {
  const divSelector = useRef();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMap, setSelectedMap] = useState("");
  const [selectedDivPoint, setSelectedDivPoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [mapDetails, setMapDetails] = useState(null);
  const [firstMap, setFirstMap] = useState(null);
  const [usersScore, setUsersScore] = useState(null)

  const handleSelectChange = (e) => {
    setSelectedProject(e.target.value);
    async function fetchMapList() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const project = await api.getProjectById(accessToken, e.target.value);
        setFirstMap(project.maps[0].id);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMapList();
    setSelectedMap('');
  };

  const handleMapSelectChange = (value) => {
    setSelectedMap(value);
  };

  const handleDivPointSelectChange = (value) => {
    setSelectedDivPoint(value)
  };

  function normalizeAuthorScores(authorsScores) {
    const highestTotalAverage = Math.max(...authorsScores.map(score => parseFloat(score.totalAverage)));
    
    // Handle the edge case where highest totalAverage is zero
    if (highestTotalAverage === 0) {
      console.warn('Highest totalAverage is zero. Normalization might not be meaningful.');
      return authorsScores; // you might want to handle this case differently
    }
  
    return authorsScores.map(score => {
      const normalizedTotalAverage = ((parseFloat(score.totalAverage) / highestTotalAverage) * 100).toFixed(2);
      return { ...score, normalizedTotalAverage };
    });
  }

  useEffect(() => {
    async function getAndSetUsersScore(selectedDivPoint) {
      if (selectedDivPoint.length === 1) {
        const usersScore = await executeCalculations(selectedDivPoint[0].value);
        const normalizedUsersScore = normalizeAuthorScores(usersScore);
        const sortedNormalizedUsersScore = normalizedUsersScore.sort((a, b) => b.score - a.score);
        setUsersScore(sortedNormalizedUsersScore)
      } else {
        const usersScore = await getMeanForAllDivPoints(selectedDivPoint);
        const normalizedUsersScore = normalizeAuthorScores(usersScore);
        const sortedNormalizedUsersScore = normalizedUsersScore.sort((a, b) => b.score - a.score);
        setUsersScore(sortedNormalizedUsersScore)
      }
    }

    selectedDivPoint !== '' && getAndSetUsersScore(selectedDivPoint);
  }, [selectedDivPoint]);

  useEffect(() => {
    setSelectedDivPoint("");
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.getMapById(accessToken, selectedMap.value);
        setMapDetails({ ...response });
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [selectedMap]);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Box padding={10}>
      <Box display="flex">
        <ProjectList disabled handleSelectChange={handleSelectChange} />
        <Link
          href={`https://app.strateegia.digital/journey/${selectedProject}/map/${firstMap}`}
          target="_blank"
          bg="#E9ECEF"
          borderRadius={" 0 6px 6px 0 "}
          fontSize={16}
          w={200}
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {i18n.t('main.link')}
        </Link>
      </Box>
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <DivPointList
        innerRef={divSelector}
        mapId={selectedMap}
        handleSelectChange={handleDivPointSelectChange}
      />
      <ExportsButtons data={usersScore || ''} saveFile={() => generateDocument(usersScore)} project={usersScore}/>
      <Loading active={isLoading} />
      <Heading as="h3" size="md" mb={3} mt={3}>
        {i18n.t('main.heading')}
      </Heading>
      {mapDetails?.points ? (
        <Box mt={3}>
         
        </Box>
      ) : null}
      {selectedDivPoint !== "" ? (
        <Box mt={10} display='flex' justifyContent='left'>
          <UserTable usersScore={usersScore}/>
        </Box>
      ) : null}
    </Box>
  );
}
