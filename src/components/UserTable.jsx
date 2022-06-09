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

export const THeader = ({text, weight, alignment}) => {
    return (
        <Th 
            textTransform='lowercase'
            textAlign={alignment || 'center'}
            fontWeight={weight || 500}
            className='biggerTh'
            fontFamily='Montserrat, sans-serif'
            fontSize={16}
        >
            {text}
        </Th>
    )
}

const UserTable = ({usersScore}) => {
   

    return (
        // <TableContainer>
            <Table variant='striped' w='50vw'>
                <Thead>
                <Tr textTransform='lowercase' >
                    <THeader alignment='left' text={i18n.t('userTable.th1')}/>
                    <THeader text={i18n.t('userTable.th2')}/>
                    <THeader text={i18n.t('userTable.th3')}/>
                    <THeader text={i18n.t('userTable.th4')} weight={800}/>
                   
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
                        </Tr>
                    )
                )}
                
                </Tbody>
            </Table>
        // </TableContainer>
    )
}

export default UserTable;