import React from "react";
import { 
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td, 
} from '@chakra-ui/react';
import { i18n } from "../translate/i18n";

export const THeader = ({text, weight, alignment, width}) => {
    return (
        <Th 
            textTransform='lowercase'
            textAlign={alignment || 'center'}
            fontWeight={weight || 500}
            className='biggerTh'
            fontFamily='Montserrat, sans-serif'
            fontSize={16}
            minW={width || 'auto' }
        >
            {text}
        </Th>
    )
}

const UserTable = ({usersScore}) => {
  function approximateNumber(inputNumber) {
      const roundedNumber = Math.round(inputNumber);
      if (roundedNumber >= 0 && roundedNumber <= 25) {
          return 25;
      } else if (roundedNumber >= 26 && roundedNumber <= 50) {
          return 50;
      } else if (roundedNumber >= 51 && roundedNumber <= 75) {
          return 75;
      } else if (roundedNumber > 75) {
          return 100;
      } else {
          console.error('Input number is out of valid range (below 0)');
          return null; // or handle the error as appropriate for your application
      }
    }

    return (
        <Table variant='striped' w='60vw'>
            <Thead>
            <Tr textTransform='lowercase' >
                <THeader alignment='left' text={i18n.t('userTable.th1')}/>
                <THeader width={'120px'} text={i18n.t('userTable.th2')}/>
                <THeader text={i18n.t('userTable.th3')}/>
                <THeader text={i18n.t('userTable.th4')}/>
                <THeader text={i18n.t('userTable.th5')} weight={800}/>
                <THeader text={i18n.t('userTable.th6')} weight={800}/>
                <THeader text={i18n.t('userTable.th7')} weight={800}/>
            </Tr>
            </Thead>
            <Tbody>
            {usersScore
                ?.map((user) => (
                    <Tr key={user.id}>
                        <Td key={user.name} textTransform='lowercase'> 
                            {user.name}
                        </Td>
                        <Td key={user.metrica1 + '' + user.id} textAlign='center'>{user.metrica1} %</Td>
                        <Td key={user.id + user.metrica2 + user.id} textAlign='center'>{user.metrica2} %</Td>
                        <Td key={user.id + user.score} textAlign='center'>{user.score} %</Td>
                        <Td key={user.id + '' + user.totalAverage} textAlign='center' px={4}>{user.totalAverage} %</Td>
                        <Td key={user.id + '' + user.normalizedTotalAverage} textAlign='center'>{user.normalizedTotalAverage}</Td>
                        <Td key={user.id + '' + user.normalizedTotalAverage + '' + user.id} textAlign='center'>{approximateNumber(user.normalizedTotalAverage)}</Td>
                    </Tr>
                )
            )}
            
            </Tbody>
        </Table>
    )
}

export default UserTable;
