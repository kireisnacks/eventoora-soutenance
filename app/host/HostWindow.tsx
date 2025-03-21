'use client';

import { useState, useMemo } from 'react';
import { useForm, FieldValues , SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import HostForm from './HostForm';
import Heading from '../components/Heading';
import LogoInput from '../components/inputs/LogoInput';
import HostFormInput from '../components/inputs/HostFormInput';
import AutocompleteInput from '../components/inputs/AutocompleteInput';
import Counter from '../components/inputs/Counter';
import TextArea from '../components/inputs/TextArea';
import Boolean from '../components/inputs/Boolean';
import Dropdown from '../components/inputs/Dropdown';
import ImageUpload from '../components/inputs/ImageUpload';
import OperatingHours from '../components/inputs/OperatingHours';
import RadioBox from '../components/inputs/RadioBox';
import ImageSelector from '../components/inputs/ImageSelector';
import AssetSelector from '../components/inputs/AssetSelector';

import { AlarmClock , Plus , DollarSign } from 'lucide-react';

enum STEPS {
  LOCATION = 0,
  CATEGORY = 1,
  INFO = 2,
  IMAGES = 3,
  HOURS = 4,
  POLICY = 5,
  PRICE = 6,
}

export const cancellationPolicies = {
  veryFlexible: {
    title: "Très Flexible",
    description: "Les clients peuvent annuler leur réservation jusqu'à 24 heures avant l'heure de début de l'événement et recevront un remboursement intégral (incluant tous les frais) du prix de leur réservation. Les annulations soumises moins de 24 heures avant l'heure de début de l'événement ne sont pas remboursables."
  },
  flexible: {
    title: "Flexible",
    description: "Les clients peuvent annuler leur réservation jusqu'à 7 jours avant l'heure de début de l'événement et recevront un remboursement intégral (incluant tous les frais) du prix de leur réservation. Les clients peuvent annuler leur réservation entre 7 jours et 24 heures avant l'heure de début de l'événement et recevoir un remboursement de 50% (hors frais) du prix de leur réservation. Les annulations soumises moins de 24 heures avant l'heure de début de l'événement ne sont pas remboursables."
  },
  standard30: {
    title: "Standard 30 jours",
    description: "Les clients peuvent annuler leur réservation jusqu'à 30 jours avant l'heure de début de l'événement et recevront un remboursement intégral (incluant tous les frais) du prix de leur réservation. Les clients peuvent annuler leur réservation entre 30 jours et 7 jours avant l'heure de début de l'événement et recevoir un remboursement de 50% (hors frais) du prix de leur réservation. Les annulations soumises moins de 7 jours avant l'heure de début de l'événement ne sont pas remboursables."
  },
  standard90: {
    title: "Standard 90 jours",
    description: "Les clients peuvent annuler leur réservation jusqu'à 90 jours avant l'heure de début de l'événement et recevront un remboursement intégral (incluant tous les frais) du prix de leur réservation. Les clients peuvent annuler leur réservation entre 90 jours et 14 jours avant l'heure de début de l'événement et recevoir un remboursement de 50% (hors frais) du prix de leur réservation. Les annulations soumises moins de 14 jours avant l'heure de début de l'événement ne sont pas remboursables."
  }
};

const HostWindow = () => {
  const router = useRouter();
  const testPlaces = [
    "Salle de réception",
    "Terrain de foot",
    "Terrain de basket",
    "Restaurant",
    "Bar",
    "Piscine",
    "Salle de danse",
    "Studio photo",
    "Salle de concert",
    "Terrain de tennis",
    "Salle de yoga",
    "Cave à vin",
    "Rooftop",
    "Jardin",
    "Terrasse",
    "Salle de conférence",
    "Espace coworking",
    "Studio d'enregistrement",
    "Salle de sport",
    "Galerie d'art",
    "Atelier d'artiste",
    "Salle de cinéma",
    "Bowling",
    "Salle d'arcade",
    "Escape game",
    "Salle de théâtre",
    "Court de squash",
    "Salle de billard",
    "Terrain de pétanque",
    "Spa"
  ]

  const ageOptions = [
    { label: 'Tous', value: 0 },
    ...Array.from({ length: 21 }, (_, i) => ({
      label: `Âgé de +${i + 1} ans`,
      value: i + 1
    }))
  ]
  

  const [step, setStep] = useState(STEPS.LOCATION);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      city: '',
      address: '',
      postalCode: '',
      category: '',
      size: 0,
      capacity:0,
      parkingDescription:'',
      scard: false, //security camera and recording devices
      title: '',
      description:'',
      rules: '',
      minimumAge: 0,
      instructions: '',
      thumbnail: [],
      cancellationPolicy:'',
      price: 1,
      minimumHour: 1,
      mainCategories: [],
      operatingHours: [      
        { dayOfWeek: 'Lundi', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { dayOfWeek: 'Mardi', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { dayOfWeek: 'Mercredi', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { dayOfWeek: 'Jeudi', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { dayOfWeek: 'Vendredi', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { dayOfWeek: 'Samedi', isOpen: true, openTime: '09:00', closeTime: '17:00' },
        { dayOfWeek: 'Dimanche', isOpen: true, openTime: '09:00', closeTime: '17:00' }
      ],
      assets: [],
    }
  });

  const size = watch('size');
  const capacity = watch('capacity');
  const scard = watch('scard');
  const minimumAge = watch('minimumAge');
  const thumbnail = watch('thumbnail');
  const cancellationPolicy = watch('cancellationPolicy');
  const mainCategories = watch('mainCategories');
  const operatingHours = watch('operatingHours');
  const assets = watch('assets');

  const category = watch('category');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios.post('/api/spaces', data)
    .then(() => {
      toast.success('Espace créé!');
      router.refresh();
      reset();
      setTimeout(() => {
        router.push('/');
      }, 1500);
    })
    .catch(() => {
      toast.error('Something went wrong.');
    })
    .finally(() => {
      setIsLoading(false);
    })
  }  

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Create';
    }

    return 'Next';
  },[step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return 'Back';
  },[step]);

  let bodyContent = (
    <div className = "flex flex-col gap-8 ">
        <Heading
          title='Où est votre espace ?'
          subtitle='Il est important de situer votre espace afin que les gens puissent le trouver.'
        />
        <HostFormInput 
            id="city"
            label="Ville"  
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <HostFormInput 
            id="address"
            label="Addresse"  
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <HostFormInput 
            id="postalCode"
            label="Code Postal"  
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
    </div>
  )

  if(step===STEPS.CATEGORY) {
    bodyContent = (
      <div className = "flex flex-col gap-8 ">
        <Heading
          title='Type de votre espace.'
          subtitle='Exemple : Salle de réception, Studio photo, Restaurant, etc.'
        />
        <AutocompleteInput
          id="category"
          label="Type de lieu"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          suggestions={testPlaces}
        />
        <br/>
        <hr />
        <Heading
          title="Taille et capacité."
          subtitle="Combien de m² et jusqu'à combien de personnes votre espace peut-il accueillir ?"
        />
        <div className="flex flex-col md:flex-row items-center w-full gap-8">
          <div className="flex-1 w-full">
            <Counter
              title="Taille"
              subtitle="en m²"
              value={size}
              onChange={(value) => setCustomValue('size', value)}
            />
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-[1px] bg-neutral-300" />
          </div>
          <div className="flex-1 w-full">
            <Counter
              title="Capacité"
              subtitle="Nombre max de personnes"
              value={capacity}
              onChange={(value) => setCustomValue('capacity', value)}
            />
          </div>
        </div>
        <br/>
        <hr />
        <Heading
          title="Options de parking."
          subtitle="Y a t-il un parking ? Si oui, décrivez-le. Si non, comment les gens doivent-ils faire si ils arrivent en voiture."
        />
        <TextArea 
          id="parkingDescription"
          minLength={35}
          disabled={isLoading}
          register={register}
          errors={errors}
          placeholder="Parking privé , places de rue, parking public ;  nombre de places , payant/gratuit , surveillance, etc."
          required
        />
        <br/>
        <hr />
        <Heading
          title="Dispositifs de surveillance."
          subtitle="Votre espace est-il équipé de caméras de sécurité ou d'appareils d'enregistrement ?"
        />
        <Boolean 
          value={scard}
          onChange={(value) => setCustomValue('scard', value)}
        />
        <br/>
        <hr />
      </div>
    )
  }

  if(step===STEPS.INFO) {
    bodyContent = (
      <div className = "flex flex-col gap-8 ">
        <Heading
          title='Titre de votre espace.'
          subtitle='TBD'
        />
        <HostFormInput
          id="title"
          label="Titre"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <br />
        <hr />
        <Heading
          title='Description de votre espace.'
          subtitle='TBD'
        />
        <TextArea
          id="description"
          minLength={100}
          maxLength={1000}
          disabled={isLoading}
          register={register}
          errors={errors}
          placeholder="Décrivez votre espace."
          required
        />
        <br />
        <hr />
        <Heading
          title='Règlement de votre espace.'
          subtitle='TBD'
        />
        <TextArea
          id="rules"
          minLength={35}
          disabled={isLoading}
          register={register}
          errors={errors}
          placeholder="Règles de l'hébergement."
          required
        />
        <br />
        <hr />
        <Heading
          title='Âge autorisé dans votre espace.'
          subtitle='TBD'
        />
        <Dropdown 
          id="minimumAge"
          options={ageOptions}
          value={minimumAge}
          onChange={(value) => setCustomValue('minimumAge', value)}
        />
        <br />
        <hr />

        <Heading
          title="Instructions pour atteindre l'espace."
          subtitle='TBD'
        />
        <TextArea
          id="instructions"
          minLength={35}
          disabled={isLoading}
          register={register}
          errors={errors}
          placeholder="Règles de l'hébergement."
          required
        />
        <br />
        <hr />
      </div>
  )}

  if(step === STEPS.IMAGES){
    bodyContent = (
      <div className = "flex flex-col gap-8 ">
        <Heading
          title="Images de votre espace."
          subtitle="Montrez aux utilisateurs à quoi ressemble votre espace !"
        />
        <ImageUpload 
          value={thumbnail}
          onChange={(value) => setCustomValue('thumbnail',value)}/>
      </div>
    )
  }

  if(step === STEPS.HOURS){
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Horaires d'ouverture"
          subtitle="Définissez vos créneaux horaires pour chaque jour de la semaine. Vous pouvez ajouter plusieurs créneaux par jour ou marquer certains jours comme fermés."
        />
        <OperatingHours 
          value={operatingHours}
          onChange={(hours) => setValue('operatingHours', hours)}
        />
      </div>
    )
  }

  if(step === STEPS.POLICY){
    bodyContent = (
      <div className="flex flex-col gap-8">
      <Heading
        title="Politique d'annulation"
        subtitle="Choisissez la politique d'annulation qui convient le mieux à votre espace"
      />
      <div className="grid gap-4">
        {Object.entries(cancellationPolicies).map(([key, policy]) => (
          <RadioBox
            key={key}
            id={key}
            label={policy.title}
            description={policy.description}
            selected={cancellationPolicy === key}
            onChange={() => setCustomValue('cancellationPolicy', key)}
          />
        ))}
      </div>
    </div>
    )
  }

  if(step === STEPS.PRICE){
    console.log(watch())
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Types d'activités"
          subtitle="Sélectionnez les activités que vous souhaitez accueillir dans votre espace"
        />
        <ImageSelector
          value={mainCategories}
          onChange={(value) => setCustomValue('mainCategories', value)}
        />
        <br/>
        <hr />
        <Heading
          title="Prix"
          subtitle="Définissez le prix de votre espace par heure ainsi que le nombre minimal d'heure"
        />
        <div className="w-full md:w-1/2">
          <LogoInput
            id="price"
            icon={DollarSign}
            label="Prix Horaire"
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
        <div className="w-full md:w-1/2">
          <LogoInput
            id="minimumHour"
            icon={AlarmClock}
            label="Heures Minimum (Entre 1 et 12)"
            type="number"
            min={1}
            max={12}
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
        <br/>
        <hr />
        <Heading 
          title="Equipements"
          subtitle='Tous les équipements que vous sélectionnez doivent être inclus dans votre tarif horaire. Si vous facturez certains équipements, ne les incluez pas ici. Vous pourrez les ajouter dans une autre section.'
        />
        <AssetSelector
          id="assets"
          label="Ajouter un équipement personnalisé"
          required
          register={register}
          errors={errors}
          selectedAssets={assets}
          onAssetsChange={(assets) => setCustomValue('assets', assets)}
        />
      </div>
      
    )
  }

  return (
    <div className="mx-auto w-full md:w-2/3 bg-white rounded-lg shadow-xl p-4 md:p-8">
      <HostForm
        currentStep={step}
        totalSteps={Object.keys(STEPS).length / 2}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
        body={bodyContent}
      />
    </div>
  )
}

export default HostWindow;
