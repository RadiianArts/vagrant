import s from './style.module.css'
import { VMWARE_UTILITY_VERSION } from 'data/version.json'
import ProductDownloader from '@hashicorp/react-product-downloader'
import Head from 'next/head'
import HashiHead from '@hashicorp/react-head'

export default function DownloadsPage({ downloadData }) {
  return (
    <div className={s.root}>
      <HashiHead
        is={Head}
        title="VMWare Utility Downloads | Vagrant by HashiCorp"
      />
      <ProductDownloader
        product="Vagrant VMWare Utility"
        baseProduct="Vagrant"
        version={VMWARE_UTILITY_VERSION}
        downloads={downloadData}
        changelog={false}
      />
    </div>
  )
}

export async function getStaticProps() {
  return fetch(
    `https://releases.hashicorp.com/vagrant-vmware-utility/${VMWARE_UTILITY_VERSION}/index.json`
  )
    .then((r) => r.json())
    .then((r) => {
      // TODO: restructure product-downloader to run this logic internally
      return r.builds.reduce((acc, build) => {
        if (!acc[build.os]) acc[build.os] = {}
        acc[build.os][build.arch] = build.url
        return acc
      }, {})
    })
    .then((r) => ({ props: { downloadData: r } }))
    .catch(() => {
      throw new Error(
        `--------------------------------------------------------
        Unable to resolve version ${VMWARE_UTILITY_VERSION} on releases.hashicorp.com from link
        <https://releases.hashicorp.com/vagrant-vmware-utility/${VMWARE_UTILITY_VERSION}/index.json>. Usually this
        means that the specified version has not yet been released. The downloads page
        version can only be updated after the new version has been released, to ensure
        that it works for all users.
        ----------------------------------------------------------`
      )
    })
}
