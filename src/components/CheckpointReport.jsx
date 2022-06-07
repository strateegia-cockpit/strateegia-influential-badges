import { Box, UnorderedList, ListItem, Text } from '@chakra-ui/react';
import { ExportsButtons } from './ExportsButtons';
import { exportJSONData } from '../utils/exportsFunctions';

export function CheckpointReport({ checkpointAndComments }) {
  return (
    <Box marginTop="8px">
      {checkpointAndComments ? (
        <>
          <ExportsButtons
            checkpointAndComments={checkpointAndComments}
            exportJSONData={exportJSONData}
          />
          {checkpointAndComments.map(checkpointAndComment => (
            <Box margin={10}>
              <strong>{checkpointAndComment.checkpoint.description}</strong>
              <p>local: {checkpointAndComment.checkpoint.meeting_place}</p>
              <p>
                data:{' '}
                {new Date(
                  checkpointAndComment.checkpoint.opening_date
                ).toLocaleString('pt-BR')}
              </p>
              <UnorderedList margin={5}>
                {checkpointAndComment.comments.map(comment => (
                  <ListItem key={comment.id}>
                    <Text>
                      {comment.author.name}: {comment.text}
                    </Text>
                    {/* <Text>Criador: {comment.author.name}</Text> */}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          ))}
        </>
      ) : (
        <p>sem pontos de conversação</p>
      )}
    </Box>
  );
}
