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
   

    return (
        <Table variant='striped' w='60vw'>
            <Thead>
            <Tr textTransform='lowercase' >
                <THeader alignment='left' text={i18n.t('userTable.th1')}/>
                <THeader width={'120px'} text={i18n.t('userTable.th2')}/>
                <THeader text={i18n.t('userTable.th3')}/>
                <THeader text={i18n.t('userTable.th4')}/>
                <THeader text={'média'} weight={800}/>
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
                        <Td key={user.id + ((user.metrica1 + user.metrica2 + user.score)/3.0)} textAlign='center'>{(user.metrica1 + user.metrica2 + user.score)/3.0} %</Td>
                    </Tr>
                )
            )}
            
            </Tbody>
        </Table>
    )
}

export default UserTable;
