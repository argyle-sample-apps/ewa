import { Heading } from "components/typography";
import { DataPoint } from "components/data-point";
import { useProfile } from "hooks/useProfile";
import { formatAddress } from "utils";
import { LineLoader, LoadingError } from "components/loader";

export function ProfileInfo() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfile();

  const ProfileContent = () => {
    if (isProfileLoading) {
      return <LineLoader length={5} />;
    }

    if (isProfileError) {
      return <LoadingError />;
    }

    return (
      <>
        <DataPoint label="First name" value={profile.first_name} />
        <DataPoint label="Last name" value={profile.last_name} />
        <DataPoint label="Date of birth" value={profile.birth_date} />
        <DataPoint label="Address" value={formatAddress(profile.address)} />
        <DataPoint label="Social Security number" value={profile.ssn} />
      </>
    );
  };

  const ContactContent = () => {
    if (isProfileLoading) {
      return <LineLoader length={2} />;
    }

    if (isProfileError) {
      return <LoadingError />;
    }

    return (
      <>
        <DataPoint label="Phone number" value={profile.phone_number} />
        <DataPoint label="Email address" value={profile.email} />
      </>
    );
  };

  return (
    <>
      <Heading className="mb-6 mt-4">Personal information</Heading>
      <ProfileContent />
      <Heading className="mb-6 mt-4">Contact information</Heading>
      <ContactContent />
    </>
  );
}
