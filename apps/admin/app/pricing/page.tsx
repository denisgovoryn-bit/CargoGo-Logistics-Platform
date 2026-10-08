'use client';

import { useState } from 'react';

import { PageHeader } from '@/components/admin-shell';

const initialPricing = {
  minimum: '490',
  perKm: '32',
  largeVan: '300',
  truck: '800',
  driverHelp: '250',
  floor: '90',
  commission: '15',
  loaderHourlyRate: '300',
  maximumLoaders: '2',
  billingIncrement: '15',
  standardLoading: '30',
  standardUnloading: '30',
  estimatedArrival: '20',
};

export default function PricingPage() {
  const [pricing, setPricing] = useState(initialPricing);
  const [saved, setSaved] = useState(false);
  const field = (key: keyof typeof pricing, label: string, suffix: string) => <label>{label}<span className="input-suffix"><input type="number" min="0" value={pricing[key]} onChange={(event) => { setSaved(false); setPricing((current) => ({ ...current, [key]: event.target.value })); }} /><small>{suffix}</small></span></label>;
  return (
    <>
      <PageHeader title="Pricing" description="Configure prototype pricing. Values remain in this browser tab only." />
      <section className="panel form-panel pricing-form"><h2>Base and loader pricing</h2><div className="form-grid">{field('minimum', 'Minimum order price', 'CZK')}{field('perKm', 'Price per kilometer', 'CZK')}{field('largeVan', 'Large Van surcharge', 'CZK')}{field('truck', 'Truck surcharge', 'CZK')}{field('driverHelp', 'Driver help', 'CZK')}{field('floor', 'Floor without elevator', 'CZK / floor')}{field('loaderHourlyRate', 'Loader hourly rate per person', 'CZK / hour')}{field('maximumLoaders', 'Maximum loaders', 'people')}{field('billingIncrement', 'Billing increment in minutes', 'minutes')}{field('standardLoading', 'Standard loading time', 'minutes')}{field('standardUnloading', 'Standard unloading time', 'minutes')}{field('estimatedArrival', 'Estimated arrival time', 'minutes')}{field('commission', 'Platform commission percentage', '%')}</div><p className="cell-note">Live mock preview: {Number(pricing.loaderHourlyRate) * 2 * Math.ceil((Number(pricing.estimatedArrival) + Number(pricing.standardLoading) + Number(pricing.standardUnloading)) / Number(pricing.billingIncrement)) * Number(pricing.billingIncrement) / 60} CZK for two loaders. Commission: {pricing.commission}%.</p><p className="cell-note">TODO: move this duplicate mobile/admin pricing configuration to Supabase when a backend is connected.</p><button type="button" onClick={() => setSaved(true)}>Save local pricing</button>{saved ? <p className="success-note">Pricing saved locally for this session.</p> : null}</section>
    </>
  );
}
