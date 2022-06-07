import { Box, UnorderedList, ListItem } from '@chakra-ui/react';

function ConvergencePointList({ convergencePoints }) {
  return (
    <Box>
      {convergencePoints.length > 0 ? (
        convergencePoints.map(convergencePoint =>
          convergencePoint.questions.map(question => (
            <Box margin={10}>
              <p key={question.id}>{question.text}</p>
              <UnorderedList margin={5}>
                {question.options.map(option => (
                  <ListItem key={option.id}>{option.text}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          ))
        )
      ) : (
        <p>sem pontos de convergência</p>
      )}
    </Box>
  );
}
