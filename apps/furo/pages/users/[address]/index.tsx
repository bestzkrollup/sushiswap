import { Typography } from '@sushiswap/ui'
import Layout from 'components/Layout'
import { FuroTable, FuroTableType } from 'features/FuroTable'
import { CreateStreamModal } from 'features/stream'
import CreateVestingModal from 'features/vesting/CreateVestingModal'
import { getStreams, getVestings } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { Streams } from '../../api/streams/[chainId]/[address]'
import { Vestings } from '../../api/vestings/[chainId]/[address]'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

interface Props {
  fallback?: Record<string, any>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.address !== 'string') return { props: {} }

  return {
    props: {
      fallback: {
        [`/api/streams/${query.chainId}/${query.address}`]: (await getStreams(query.chainId, query.address)) as Streams,
        [`/api/vestings/${query.chainId}/${query.address}`]: (await getVestings(
          query.chainId,
          query.address,
        )) as Vestings,
      },
    },
  }
}

const _Dashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const address = router.query.address as string

  return (
    <SWRConfig value={{ fallback }}>
      <Dashboard chainId={chainId} address={address} />
    </SWRConfig>
  )
}

export const Dashboard: FC<{ chainId: number; address: string }> = ({ chainId, address }) => {
  const { data: streams, isValidating } = useSWR<Streams>(`/furo/api/streams/${chainId}/${address}`, fetcher)
  const { data: vestings, isValidating: isValidating2 } = useSWR<Vestings>(
    `/furo/api/vestings/${chainId}/${address}`,
    fetcher,
  )

  return (
    <Layout>
      <div className="flex flex-col h-full gap-12 pt-10">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <Typography variant="h3" weight={700} className="text-slate-200">
            Dashboard
          </Typography>
          <div className="flex gap-3">
            <CreateStreamModal />
            <CreateVestingModal />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Typography variant="lg" weight={700} className="text-slate-200">
              Incoming
            </Typography>
            <FuroTable
              loading={isValidating}
              streams={streams?.incomingStreams ?? []}
              vestings={vestings?.incomingVestings ?? []}
              type={FuroTableType.INCOMING}
              placeholder="No incoming streams found"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Typography variant="lg" weight={700} className="text-slate-200">
              Outgoing
            </Typography>
            <FuroTable
              loading={isValidating2}
              streams={streams?.outgoingStreams ?? []}
              vestings={vestings?.outgoingVestings ?? []}
              type={FuroTableType.OUTGOING}
              placeholder="No outgoing streams found"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default _Dashboard
