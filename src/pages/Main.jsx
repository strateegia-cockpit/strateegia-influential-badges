import {
  Box,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
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

export default function Main() {
  const divSelector = useRef();
  const [selectedProject, setSelectedProject] = useState("");
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
  };

  const handleMapSelectChange = (e) => {
    const mapId = e.target.value;
    
    if (mapId.length === 24) {
      setSelectedMap(mapId);
    } else {
      const mapsIdArr = mapId.split(',');
      setSelectedMap(mapsIdArr); 
    }
  };

  useEffect(() => {
    setTimeout(() => {
      typeof selectedMap === 'object' && setSelectedDivPoint(divSelector.current[1].value)
    }, 1000);
  }, [selectedMap])

  const handleDivPointSelectChange = async (e) => {
    setSelectedDivPoint(e.target.value);
    console.log("🚀 ~ file: Main.jsx ~ line 60 ~ handleDivPointSelectChange ~ e.target.value", e.target.value)
  };

  useEffect(() => {
    async function getAndSetUsersScore(selectedDivPoint) {
      if (selectedDivPoint.length === 24) {
        const usersScore = await executeCalculations(selectedDivPoint);
        setUsersScore(usersScore)
      } else {
        const usersScores = await getMeanForAllDivPoints(selectedDivPoint);
        setUsersScore(usersScores)
      }
    }

    selectedDivPoint !== '' && getAndSetUsersScore(selectedDivPoint);
  }, [selectedDivPoint]);

  useEffect(() => {
    setSelectedMap("");
  }, [selectedProject])

  useEffect(() => {
    console.log(usersScore)
  }, [usersScore])

  useEffect(() => {
    setSelectedDivPoint("");
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.getMapById(accessToken, selectedMap);
        setMapDetails({ ...response });
        // [TODO] - use the access token to fetch the data
        // [TODO] - add the fetch data function here
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
        <ProjectList handleSelectChange={handleSelectChange} />
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
      <Loading active={isLoading} />
      <Heading as="h3" size="md" mb={3} mt={3}>
        {i18n.t('main.heading')}
      </Heading>
      {/* [TODO] Add you component here */}
      {mapDetails?.points ? (
        <Box mt={3}>
         
        </Box>
      ) : null}
      {selectedDivPoint !== "" ? (
        <Box mt={3} display='flex' justifyContent='center'>
          <UserTable usersScore={usersScore}/>
        </Box>
      ) : null}
    </Box>
  );
}
