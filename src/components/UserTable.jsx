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

export const THeader = ({text, weight}) => {
    return (
        <Th 
            textTransform='lowercase'
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
                    <THeader text={i18n.t('userTable.th1')}/>
                    <THeader text={i18n.t('userTable.th2')}/>
                    <THeader text={i18n.t('userTable.th3')}/>
                    <THeader text={i18n.t('userTable.th4')} weight={800}/>
                   
                </Tr>
                </Thead>
                <Tbody>
                {usersScore
                    ?.map((user, index) => (
                        <Tr className={index % 2 === 0 ? 'strip' : ''}>
                            <Td className="user_name" textTransform='lowercase'> 
                                {user.name}
                            </Td>
                            <Td>{user.metrica1} %</Td>
                            <Td>{user.metrica2} %</Td>
                            <Td>{user.score} %</Td>
                        </Tr>
                    )
                )}
                
                </Tbody>
            </Table>
        // </TableContainer>
    )
}

export default UserTable;